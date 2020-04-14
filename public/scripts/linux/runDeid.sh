#!/bin/bash
basedir="$1"
outdir="$2"
scriptdir="$3"
source ~/miniconda3/etc/profile.d/conda.sh

conda activate deid
pushd public/scripts/deiden/
export PYTHONPATH=$PYTHONPATH:$(pwd)/src

rm -rf $outdir
echo "Running " $scriptdir $basedir --outdir $outdir
python $scriptdir $basedir --outdir $outdir
