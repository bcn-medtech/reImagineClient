set condapath=%1
set condahome=%2
set envname=%3

call %condapath% %condahome%

call conda create -n %envname% python=3.9 sqlalchemy -y
call conda install --name %envname% -c SimpleITK SimpleITK=2.1 -y
call conda install --name %envname% -c conda-forge pydicom=1.2.1 -y
call conda install --name %envname% -c conda-forge deid=0.1.42 -y



