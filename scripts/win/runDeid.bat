
call conda activate deid
SET PYTHONPATH=$PYTHONPATH:$(%cd%)/src
SET basedir=%1
SET outdir=%2
SET scriptpath=%3
SET sqlfile=%4

RMDIR /Q  $outdir

python %scriptpath% %basedir% --outdir %outdir% --db-location %sqlfile%
