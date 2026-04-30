@echo off
setlocal
cd /d "%~dp0"

for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /R /C:"IPv4 Address"') do (
  set "IP_RAW=%%A"
  goto :gotip
)

:gotip
set "IP=%IP_RAW: =%"
if "%IP%"=="" set "IP=127.0.0.1"

echo.
echo ============================================
echo   Punisher Store Local Server
echo ============================================
echo Open on phone:
echo http://%IP%:5500/index.html
echo.
echo Keep this window open. Press CTRL+C to stop.
echo.

python -m http.server 5500

endlocal
