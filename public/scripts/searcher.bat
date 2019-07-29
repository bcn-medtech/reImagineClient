

SET basedir=%1
SET currentDir=%cd%

cd\


for /f "delims=" %%a in ('dir %basedir% /S /b') do @set foobar=%%a

if [%foobar%]==[] (
    exit 1
) ELSE (
    cd %currentDir%\public\scripts\tmp
    @echo %foobar% > %basedir%.txt
    exit 0
)



