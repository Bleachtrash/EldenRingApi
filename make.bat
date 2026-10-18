@echo off
g++ main.cpp -o main -Iinclude -static-libgcc -static-libstdc++ -lws2_32 -lwsock32

if errorlevel 1 goto ERROR
if [%1] == [-r] main.exe
exit /b 0

:ERROR
cmd /k
exit /b 1