#!/bin/bash
echo "Test deiden"
source ~/miniconda3/etc/profile.d/conda.sh

conda activate deid
pushd public/scripts/deiden/
echo $(pwd)
export PYTHONPATH=$PYTHONPATH:$(pwd)/src
basedir="$1"
outdir="$2"

rm -rf $outdir
echo "Running:" python src/deidTest_pyd.py $basedir --outdir $outdir
python src/deidTest_pyd.py $basedir --outdir $outdir






