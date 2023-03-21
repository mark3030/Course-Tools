@echo off

setlocal

archive.exe a -mx7 app.7z ..\release\Course-NeciBook-win32-x64\*
copy /b *.7zip.sfx + config.7zip.txt + app.7z ..\KReactCover-1.0.0.exe

del /f /q app.7z