#!/bin/bash
source ~/miniconda3/etc/profile.d/conda.sh

conda activate deid
echo $(ls)

# This is the root folder of all the anonimized images
ANON_DATA=$1
PORT=$2

# Those are hardcoded for now but in the future we should open them on ingress controller
IPS="10.55.0.115"
echo "gdcmscu --store $IPS $PORT --call ORTHANC $ANON_DATA"
# This is the command to send the modalities to the PACS
gdcmscu --store $IPS $PORT --call ORTHANC $ANON_DATA
# gdcmscu --store 10.55.0.115 32713 --call ORTHANC /home/gerardgarcia/Documents/Anonimized_Files/1.3.12.2.1107.5.1.4.24550.4.0.8780153931891247/1.3.12.2.1107.5.1.4.24550.4.0.8780154324451724.dcm