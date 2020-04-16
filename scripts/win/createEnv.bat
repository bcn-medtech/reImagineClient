set root=C:\Users\%USERNAME%\Miniconda2

call %root%\Scripts\activate.bat %root%

REM call conda list

call conda create -n deid sqlalchemy -y
call conda install --name deid -c SimpleITK SimpleITK python=3.5 -y
call conda install --name deid -c conda-forge pydicom -y
call conda install --name deid -c conda-forge deid -y



