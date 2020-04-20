#!/bin/bash
basedir="$1"
outdir="$2"
pyscript="$3"
sqlfile="$4"
condapath="$5"
recipepath="$6"
exportdbpath="$7"
echo "Sourcing conda from" $condapath
source $condapath

echo "Activating conda environment deid..."
conda activate deid
pushd scripts/deiden/
export PYTHONPATH=$PYTHONPATH:$(pwd)/src

rm -rf $outdir
echo "Running " $pyscript $basedir --outdir $outdir --db-location $sqlfile --recipe $recipepath --export-on-save $exportdbpath
python $pyscript $basedir --outdir $outdir --db-location $sqlfile --recipe $recipepath --export-on-save $exportdbpath
