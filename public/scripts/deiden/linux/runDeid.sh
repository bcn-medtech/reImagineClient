#!/bin/bash
echo "Test deiden"
source ~/miniconda3/etc/profile.d/conda.sh

conda activate deid
pushd public/scripts/deiden/
echo $(pwd)
export PYTHONPATH=$PYTHONPATH:$(pwd)/src
basedir="$1"
outdir="$2"
scriptdir="$3"
echo $scriptdir
rm -rf $outdir
python $scriptdir $basedir --outdir $outdir
