echo "Test deiden"

REM set root=C:\Users\%USERNAME%\Miniconda2


REM call %root%\Scripts\activate.bat %root%




REM call conda remove --name deid --all -y
call conda activate deid
SET PYTHONPATH=$PYTHONPATH:$(%cd%)/src
SET basedir=%1
SET outdir=%2
SET scriptpath=%3

RMDIR /Q  $outdir
echo %cd% "hi bro"
python %scriptpath% %basedir% --outdir %outdir%
