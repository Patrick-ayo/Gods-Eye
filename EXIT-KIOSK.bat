@echo off
title Gods Eye - Exit Kiosk Mode
echo ==========================================
echo       Gods Eye - Exit Kiosk Mode
echo          Administrator Tool
echo ==========================================
echo.

echo 🔐 This tool is for administrators only!
echo.
set /p confirm="Are you sure you want to exit Kiosk Mode? (y/N): "

if /i "%confirm%" neq "y" (
    echo Operation cancelled.
    exit /b 0
)

echo.
echo 🛑 Exiting Kiosk Mode...
echo.

REM Kill Gods Eye processes
echo Terminating Gods Eye application...
taskkill /IM "Gods Eye.exe" /F

REM Re-enable Windows key
echo Re-enabling Windows key...
reg delete "HKLM\SYSTEM\CurrentControlSet\Control\Keyboard Layout" /v "Scancode Map" /f >nul 2>&1

REM Check if processes are terminated
timeout /t 2 >nul
tasklist | findstr "Gods Eye.exe" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Some processes may still be running
    echo You may need to restart the computer for full cleanup
) else (
    echo ✅ Kiosk mode successfully exited
)

echo.
echo 📋 Kiosk mode has been terminated.
echo.
echo 🔄 Note: You may need to restart Windows to:
echo  - Fully restore keyboard functionality
echo  - Clear any remaining restrictions
echo.
echo Press any key to continue...
pause >nul
