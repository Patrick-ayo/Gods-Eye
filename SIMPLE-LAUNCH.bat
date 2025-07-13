@echo off
title Gods Eye Launcher
echo ==========================================
echo          Gods Eye Launcher
echo ==========================================
echo.

echo Checking for existing instances...
tasklist | findstr "Gods Eye.exe" >nul
if %errorlevel% equ 0 (
    echo Found existing processes - cleaning up...
    taskkill /IM "Gods Eye.exe" /F >nul 2>&1
    timeout /t 2 >nul
    echo Done.
) else (
    echo No existing processes found.
)

echo.
echo Starting Gods Eye Application...
echo.

if exist "dist\win-unpacked\Gods Eye.exe" (
    echo Executable found - launching...
    cd "dist\win-unpacked"
    start "" "Gods Eye.exe"
    
    timeout /t 3 >nul
    
    tasklist | findstr "Gods Eye.exe" >nul
    if %errorlevel% equ 0 (
        echo.
        echo SUCCESS: Gods Eye launched successfully!
        echo.
        echo FEATURES:
        echo - Fullscreen kiosk mode
        echo - Login screen will appear
        echo - USB security monitoring
        echo - Comprehensive logging
        echo.
        echo TO EXIT (Admin only):
        echo - Press: Ctrl+Shift+Alt+Q
        echo - Or run: EXIT-KIOSK.bat
        echo.
        echo USER FLOW:
        echo 1. Enter email address
        echo 2. Enter OTP code
        echo 3. Access main dashboard
        echo.
    ) else (
        echo ERROR: Application failed to start
        echo Check antivirus or run as administrator
        pause
        exit /b 1
    )
) else (
    echo ERROR: Gods Eye executable not found!
    echo Location: dist\win-unpacked\Gods Eye.exe
    echo Run 'npm run pack' to rebuild
    pause
    exit /b 1
)

echo Launch completed successfully!
echo Press any key to close this window...
pause >nul
