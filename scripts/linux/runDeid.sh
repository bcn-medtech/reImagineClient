#!/bin/bash
basedir="$1"
outdir="$2"
pyscript="$3"
sqlfile="$4"
condapath="$5"
source $condapath

conda activate deid
pushd scripts/deiden/
export PYTHONPATH=$PYTHONPATH:$(pwd)/src

rm -rf $outdir
echo "Running " $pyscript $basedir --outdir $outdir --db-location $sqlfile
python $pyscript $basedir --outdir $outdir --db-location $sqlfile
