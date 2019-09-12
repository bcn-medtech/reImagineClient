#!/bin/bash
echo "Test deiden"

source /usr/bin/virtualenvwrapper.sh
workon deid
export PYTHONPATH=$PYTHONPATH:$(pwd)/src
basedir="$1"
outdir="$2"

rm -rf $outdir
python src/deidTest_pyd.py $basedir --outdir $outdir

deactivate





