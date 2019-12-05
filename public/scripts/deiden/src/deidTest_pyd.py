#!/usr/bin/python

import os, sys
import argparse
from deid.config import DeidRecipe
from deid.dicom import get_files, get_identifiers, replace_identifiers
from pydicom import read_file
import SimpleITK as sitk

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
  hdirpre = os.path.join(outdir, "headers_pre/")
  hdirpost = os.path.join(outdir, "headers_post/")      
  try:
    # Create target Directory
    os.makedirs(outdir)
    os.makedirs(hdirpre)        
    os.makedirs(hdirpost)
  except FileExistsError:
    pass        
    
  return outdir, hdirpre, hdirpost
        
def _find_or_create_anonid(db, fields):
  pid = fields["PatientID"];name = fields["PatientName"]      
  accNum = fields["AccessionNumber"]
  res = list(db.searchId(pid))
  if not res:
    _l.info("Creating new patient Patient(%s, %s, %s)"%(pid, name, accNum))
    p = db.createPatient(pid, name, accNum)
    return p.anonid
  p = res[0]
  _l.debug("Reusing existing patient Patient(%s, %s, %s)"%(p.pid, p.name, p.accessionNumber))    
  return res[0].anonid
        
def main(args):
  patients = LocalDB(verbose=False)
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
    _saveHeaders(dicom_files, hdirpre)
    
    updated_ids = dict()
    for image, fields in ids.items():  
      anonid = _find_or_create_anonid(patients, fields)
      fields['id'] = anonid
      updated_ids[image] = fields


    cleaned_files = replace_identifiers(dicom_files=dicom_files,
                                deid=recipe,
                                ids=updated_ids,
                                output_folder=outdir,
                                remove_private=True)           
    _saveHeaders(cleaned_files, hdirpost)
  print(list(patients.getAllPatients()))

def dir_path(string):
  return string

#Paths no accept spaces, pending
if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--basedir', type=dir_path, help='data dir', action='store')
  parser.add_argument('--outdir',  type=dir_path, default="outdir", help='Output data', action='store')
  parser.add_argument('--recipe', default="public/scripts/deiden/src/deid_light.dicom", help='Location of deid recipe file')                    

  args = parser.parse_args()
  print("args: ", args)
  
  main(args)


