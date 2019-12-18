#!/bin/bash
source ~/miniconda3/etc/profile.d/conda.sh

conda activate deid
echo $(ls)

# This is the root folder of all the anonimized images
ANON_DATA=$1
PORT=$2

# Those are hardcoded for now but in the future we should open them on ingress controller
DICOMPORT=PORT     
IPS=10.55.0.115

# This is the command to send the modalities to the PACS
gdcmscu --store $IPS $DICOMPORT --call ORTHANC -r "$ANON_DATA"

