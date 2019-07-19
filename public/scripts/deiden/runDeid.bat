echo "Test deiden"

set root=C:\Users\%USERNAME%\Miniconda2

call %root%\Scripts\activate.bat %root%

call conda remove --name deid --all -y
call createEnv.bat
call conda activate deid
call SET PYTHONPATH=$PYTHONPATH:$(%cd%)/src
call SET basedir=%1
call mkdir TestOutput
call SET outdir=%2

REM call RMDIR /Q  $outdir
call python src/deidTest_pyd.py $basedir --outdir $outdir





