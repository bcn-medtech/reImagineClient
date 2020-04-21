set condapath=%1
set condahome=%2

call %condapath% %condahome%

call conda create -n deid sqlalchemy -y
call conda install --name deid -c SimpleITK SimpleITK python=3.5 -y
call conda install --name deid -c conda-forge pydicom -y
call conda install --name deid -c conda-forge deid -y



