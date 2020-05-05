#!/bin/bash

condapath="$1"
condahome="$2"
envname="$3"
source $condapath $condahome

echo "Creating env..."
conda create -n $envname python=3.7 sqlalchemy -y

conda install --name $envname -c SimpleITK SimpleITK=1.2.4 -y
conda install --name $envname -c conda-forge pydicom=1.2.1 -y
conda install --name $envname -c conda-forge deid=0.1.42 -y
#   conda install --name deid -c https://services.simbiosys.upf.edu/conda/ -c conda-forge gdcm -y
   


