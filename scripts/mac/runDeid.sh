#!/bin/bash
basedir="$1"
outdir="$2"
pyscript="$3"
sqlfile="$4"
condapath="$5"
recipepath="$6"
exportdbpath="$7"
headerspath="$8"
envname="$9"
echo "Sourcing conda from" $condapath
source $condapath $envname

echo "Activating conda environment deid..."
pushd scripts/deiden/
export PYTHONPATH=$PYTHONPATH:$(pwd)/src

rm -rf $outdir
echo "Running " python $pyscript $basedir --outdir $outdir --db-location $sqlfile --recipe $recipepath --export-on-save $exportdbpath --save-headers --headers-dir $headerspath
python $pyscript $basedir --outdir $outdir --db-location $sqlfile --recipe $recipepath --export-on-save $exportdbpath --save-headers --headers-dir $headerspath

