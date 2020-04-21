#!/usr/bin/python

import os, sys
import argparse
from deid.config import DeidRecipe
from deid.dicom import get_files, get_identifiers, replace_identifiers
from pydicom import read_file
import SimpleITK as sitk

import hashlib
from operator import xor
import uuid

import time
import logging
FORMAT = '%(asctime)-15s %(message)s'
logging.basicConfig(level=logging.INFO, format=FORMAT)
_l = logging.getLogger(__name__)


from db import LocalDB

def _find_dicomdirs(basedir):
  dds = []
  for root, dirs, files in os.walk(basedir):
    if len(files) != 0:
      print(root)
      series_IDs = sitk.ImageSeriesReader.GetGDCMSeriesIDs(root)  
      if series_IDs:    
        dds.append( (root,  series_IDs))
  return dds

def _saveHeaders(dicom_files, outDir):
  for fileIn in dicom_files:
    base = os.path.basename(fileIn)
    fileOut = os.path.join(outDir, base+".headers")
    ds = read_file(fileIn)
    with open(fileOut, 'w') as wfp:
      for elem in ds.iterall():
        wfp.write(str(elem) + "\n")

  
def _print_actions(recipe):
  for action in recipe.get_actions():
    _l.info("%s(%s,%s)"%(action.get("action","NoAction"),
              action.get("field","NoField"),
              action.get("value","")))            
  
  
def _prepare(args, sid):
  outdir = os.path.join(args.outdir, sid)
  hdir = os.path.join(args.headers_dir, sid)  
  hdirpre = os.path.join(hdir, "headers_pre/")
  hdirpost = os.path.join(hdir, "headers_post/")
  try:
    # Create target Directory
    os.makedirs(outdir)
    if (args.save_headers):    
      os.makedirs(hdirpre)        
      os.makedirs(hdirpost)
  except FileExistsError:
    pass        
    
  return outdir, hdirpre, hdirpost

def _generateAnonCode(pid, name):
  clinical_id = str(pid).encode('utf-8')
  clinical_name = str(name).encode('utf-8')

  hid = hashlib.md5()
  hname = hashlib.md5()	

  hid.update(clinical_id)
  hname.update(clinical_name)

  hid = hid.digest()
  hname = hname.digest()

  idXname = bytes(map(xor, hid, hname))

  return idXname.hex()

def _find_or_create_anoncode(db, fields):
  pid = None
  if "PatientID" in fields:
    pid = fields["PatientID"]
  else:
    pid = "UNKNOWN_" + str(uuid.uuid1())
    _l.error("No patient id? Setting it to "+pid)

  name = None
  if "PatientName" in fields:
    name = fields["PatientName"]
  else:
    name = "UNKNOWN_" + str(uuid.uuid1())    
    _l.error("No patient Name? Setting it to "+name)
    

  accNum = None
  if "AccessionNumber" in fields:
    accNum = fields["AccessionNumber"]
  else:
    accNum = "UNKNOWN_" + str(uuid.uuid1())    
    _l.error("No accession number? Setting it to "+accNum)
    
    
  res = list(db.searchId(pid))
  if not res:
    _l.info("Creating new patient Patient(%s, %s, %s)"%(pid, name, accNum))
    p = db.createPatient(_generateAnonCode(pid, name), pid, name, accNum)
    return p.anoncode
  p = res[0]
  _l.debug("Reusing existing patient Patient(%s, %s, %s)"%(p.pid, p.name, p.accessionNumber))    
  return res[0].anoncode
        
def main(args):
  patients = LocalDB(verbose=False, sqlfile=args.db_location)
  patients._initdb()
  basedir = os.getcwd()
  _l.info("Loading receipe from %s"%args.recipe)
  recipe = DeidRecipe(deid=args.recipe)

  basedir = args.basedir
  _l.info( "Reading Dicom directory: %s"%basedir )
  dds = _find_dicomdirs(basedir)
  _l.info( "Found %d dicomdirs"%len(dds))
  for datadir, sids in dds:
    _l.info("Entering dir %s"%datadir)
    dicom_files = list(get_files(datadir))
    ids = get_identifiers(dicom_files)      

    sid = ids[list(ids.keys())[0]]["SeriesInstanceUID"]
    outdir, hdirpre, hdirpost = _prepare(args, sid)
    if (args.save_headers):
      _saveHeaders(dicom_files, hdirpre)
    
    updated_ids = dict()
    for image, fields in ids.items():  
      anoncode = _find_or_create_anoncode(patients, fields)
      fields['id'] = anoncode
      updated_ids[image] = fields


    cleaned_files = replace_identifiers(dicom_files=dicom_files,
                                deid=recipe,
                                ids=updated_ids,
                                output_folder=outdir,
                                remove_private=True)           
    
    if (args.save_headers):    
      _saveHeaders(cleaned_files, hdirpost)

  #print(list(patients.getAllPatients()))
  if (args.export_on_save):
    _l.info("Exporting db to " + args.export_on_save)
    patients.exportDb(args.export_on_save)


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Process some integers.')
  parser.add_argument('basedir', type=str, 
                    help='data dir')
  parser.add_argument('--outdir', type=str, default="outdir",
                    help='Output data')
  parser.add_argument('--recipe', type=str, default="deid_light.dicom",
                    help='Location of deid recipe file')
  parser.add_argument('--save-headers', action="store_true",
                    help='Save headers pre y post anonimization for debug purpose')
  parser.add_argument('--headers-dir', type=str, default="headers",
                    help='Location of saved headers pre y post anonimization')                    
  parser.add_argument('--db-location', type=str, default="patients.sqlite",
                    help='Location of the sqlite db')
  parser.add_argument('--export-on-save', type=str, default="patients.csv",
                    help='Export patient table to csv for easier visualization')

  args = parser.parse_args()
  main(args)


