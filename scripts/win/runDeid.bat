
SET PYTHONPATH=$PYTHONPATH:$(%cd%)/src
SET basedir=%1
SET outdir=%2
SET scriptpath=%3
SET sqlfile=%4
SET condapath=%5
SET recipepath=%6
SET exportdbpath=%7
SET headerspath=%8
SET envname=%9

call %condapath% 

call conda activate %envname%

RMDIR /Q $outdir

python %scriptpath% %basedir% --outdir %outdir% --db-location %sqlfile% --recipe %recipepath% --export-on-save %exportdbpath% --save-headers --headers-dir %headerspath%
