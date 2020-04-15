#!/bin/bash
basedir="$1"
outdir="$2"
scriptdir="$3"
sqlfile="$4"
source ~/miniconda3/etc/profile.d/conda.sh

conda activate deid
pushd scripts/deiden/
export PYTHONPATH=$PYTHONPATH:$(pwd)/src

rm -rf $outdir
echo "Running " $scriptdir $basedir --outdir $outdir --db-location $sqlfile
python $scriptdir $basedir --outdir $outdir --db-location $sqlfile
