#!/usr/bin/python

import os, sys
import argparse
import SimpleITK as sitk
import time

def _find_dicomdirs(basedir):
  dds = []
  for root, dirs, files in os.walk(basedir):
    if len(files) != 0:
      series_IDs = sitk.ImageSeriesReader.GetGDCMSeriesIDs(root)  
      if series_IDs:    
        dds.append( (root,  series_IDs))
  return dds

def _loadSerie(datadir, sids):
  images = {}
  for sid in sids:
    reader = sitk.ImageSeriesReader()
    print( "Loading serie %s stored in %s" % ( sid, datadir ))        
    series_file_names = reader.GetGDCMSeriesFileNames( datadir, sid )
    print( "Serie has %d instances" % ( len(series_file_names) ))        
    series_reader = sitk.ImageSeriesReader()
    series_reader.SetFileNames(series_file_names)    
    series_reader.MetaDataDictionaryArrayUpdateOn()
    series_reader.LoadPrivateTagsOn()
    image = series_reader.Execute()
    images[sid] = image
  return images

def _prepareTags(image):
  modification_time = time.strftime("%H%M%S")
  modification_date = time.strftime("%Y%m%d")
  # Copy relevant tags from the original meta-data dictionary (private tags are also
  # accessible).
  tags_to_copy = ["0010|0010", # Patient Name
                  "0010|0020", # Patient ID
                  "0010|0030", # Patient Birth Date
                  "0020|000D", # Study Instance UID, for machine consumption
                  "0020|0010", # Study ID, for human consumption
                  "0008|0020", # Study Date
                  "0008|0030", # Study Time
                  "0008|0050", # Accession Number
                  "0008|0060"  # Modality
  ]  
  direction = image.GetDirection()
  series_tag_values = [(k, image.GetMetaData(k)) for k in tags_to_copy if image.HasMetaDataKey(k)] + \
                 [("0008|0031",modification_time), # Series Time
                  ("0008|0021",modification_date), # Series Date
                  ("0008|0008","DERIVED\\SECONDARY"), # Image Type
                  ("0020|000e", "1.2.826.0.1.3680043.2.1125."+modification_date+".1"+modification_time), # Series Instance UID
                  ("0020|0037", '\\'.join(map(str, (direction[0], direction[3], direction[6],# Image Orientation (Patient)
                                                    direction[1],direction[4],direction[7]))))


                  ]  
  return series_tag_values

def _writeSerie(serie, outdir, tags):
  # Write the 3D image as a series
  # IMPORTANT: There are many DICOM tags that need to be updated when you modify an
  #            original image. This is a delicate opration and requires knowlege of
  #            the DICOM standard. This example only modifies some. For a more complete
  #            list of tags that need to be modified see:
  #                           http://gdcm.sourceforge.net/wiki/index.php/Writing_DICOM

  writer = sitk.ImageFileWriter()
  # Use the study/series/frame of reference information given in the meta-data
  # dictionary and not the automatically generated information from the file IO
  writer.KeepOriginalImageUIDOn()
  
  try:
    # Create target Directory
    os.makedirs(outdir)
  except FileExistsError:
    pass

  for i in range(serie.GetDepth()):
    _slice = serie[:,:,i]    
    # Tags shared by the series.
    for tag, value in tags:
      _slice.SetMetaData(tag, value)
    # Slice specific tags.
    _slice.SetMetaData("0008|0012", time.strftime("%Y%m%d")) # Instance Creation Date
    _slice.SetMetaData("0008|0013", time.strftime("%H%M%S")) # Instance Creation Time
    _slice.SetMetaData("0020|0032", '\\'.join(map(str,_slice.TransformIndexToPhysicalPoint((0,0,i))))) # Image Position (Patient)
    _slice.SetMetaData("0020|0013", str(i)) # Instance Number      
    
    fname = os.path.join(outdir, str(i)+".dcm")
    writer.SetFileName(fname)
    print("Writing to ", fname)  
    writer.Execute(_slice)    

def main(args):
  basedir = args.basedir
  print( "Reading Dicom directory:", basedir )
  dds = _find_dicomdirs(basedir)
  for datadir, sid in dds:
    series = _loadSerie(datadir, sid)
    for sid, serie in series.items():
      tags = _prepareTags(serie)
      serieDir = os.path.join(args.outdir, sid)
      _writeSerie(serie, serieDir, tags)    
    


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Process some integers.')
  parser.add_argument('basedir', type=str, 
                    help='data dir')
  parser.add_argument('--outdir', type=str, default="outdir",
                    help='Output data')

  args = parser.parse_args()
  main(args)
