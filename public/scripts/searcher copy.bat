

REM SET basedir=%1
REM SET currentDir=%cd%

REM cd\


REM for /f "delims=" %%a in ('where /q %basedir%') do @set foobar=%%a

REM if [%foobar%]==[] (
REM     exit 1
REM ) ELSE (
REM     cd %currentDir%\public\scripts\tmp
REM     @echo %foobar% > %basedir%.txt
REM     exit 0
REM )

SET basedir=%1
SET currentDir=%cd%

FOR /F "tokens=* USEBACKQ" %%F IN (`where /q %basedir%`) DO (
SET var=%%F
)
echo %currentDir%
cd %currentDir%\tmp
@ECHO %var% > %basedir%.txt
