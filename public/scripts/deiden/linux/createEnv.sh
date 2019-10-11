#!/bin/bash

#source ~/.bashrc
source ~/miniconda3/etc/profile.d/conda.sh
echo "CREATE ENV:" $(which conda)

ENVS=$(conda env list | grep deid | cut -f1 -d' ')
echo "Found environment " $ENVS
if [ -z "$ENVS" ]; then
    echo "Create deiden env"
    conda create -n deid sqlalchemy -y

    conda install --name deid -c conda-forge gdcm -y
    conda install --name deid -c SimpleITK SimpleITK python=3.5 -y
    conda install --name deid -c conda-forge pydicom -y
    conda install --name deid -c conda-forge deid -y
    conda install --name deid -c https://services.simbiosys.upf.edu/conda/ -c conda-forge gdcm -y

    
else 
    echo 'deid is installed'
    conda update -n base -c defaults conda -y    
    exit
fi;




#pip install virtualenvwrapper
#mkvirtualenv deid
# pip install pydicom
# pip install deid
# pip install sqlalchemy
# pip install SimpleITK

