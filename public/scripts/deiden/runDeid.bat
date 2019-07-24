echo "Test deiden"

set root=C:\Users\%USERNAME%\Miniconda2

call %root%\Scripts\activate.bat %root%


if EXIST %root%\envs\deid (
    echo yes
) ELSE (
    echo no
    Scripts\deiden\createEnv.bat
)

REM call conda remove --name deid --all -y
call conda activate deid
SET PYTHONPATH=$PYTHONPATH:$(%cd%)/src
SET basedir=%1
SET outdir=%2

RMDIR /Q  $outdir
python public/scripts\deiden\src\deidTest_pyd.py %basedir% --outdir %outdir%





