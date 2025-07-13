@echo off
title Gods Eye - Safe Launcher
echo ==========================================
echo        Gods Eye - Safe Launcher
echo      Prevents Multiple Instances
echo ==========================================
echo.

echo 🔍 Checking for existing instances...

REM Kill any existing instances first
tasklist | findstr "Gods Eye.exe" 7nul
if %errorlevel% equ 0 (
    echo ⚠️  Found existing Gods Eye processes - terminating them...
    taskkill /IM "Gods Eye.exe" /F >nul 2>&1
    timeout /t 2 >nul
    echo ✅ Existing processes terminated
) else (
    echo ✅ No existing processes found
)

echo.
echo 🚀 Starting Gods Eye Application...
echo.

if exist "dist\win-unpacked\Gods Eye.exe" (
    echo ✅ Executable found!
    echo 📍 Location: dist\win-unpacked\Gods Eye.exe
    echo.
    
    REM Change to the executable directory
    cd "dist\win-unpacked"
    
    REM Start the application
    echo 🎯 Launching Gods Eye in Kiosk Mode...
    start "" "Gods Eye.exe"
    
    REM Wait a moment for startup
    timeout /t 3 >nul
    
REM Verify it started
tasklist | findstr "Gods Eye.exe" 7nul
if %errorlevel% equ 0 (
        echo.
        echo ✅ Gods Eye launched successfully!
        echo.
        echo 📋 Application Features:
        echo  - Fullscreen kiosk mode active
        echo  - Login screen should appear
        echo  - USB security monitoring enabled
        echo  - Comprehensive logging system
        echo.
        echo 🔐 To exit (Admin only):
        echo  - Press: Ctrl+Shift+Alt+Q
        echo  - Or run: EXIT-KIOSK.bat
        echo.
        echo 📝 Expected user flow:
        echo  1. Enter email address
        echo  2. Enter OTP verification code
        echo  3. Access main monitoring dashboard
        echo.
    ) else (
        echo ❌ Application failed to start properly
        echo.
        echo 🔧 Troubleshooting:
        echo  - Check if antivirus is blocking the exe
        echo  - Try running as administrator
        echo  - Ensure no firewall blocking
        echo.
        pause
        exit /b 1
    )
    
) else (
    echo ❌ ERROR: Gods Eye executable not found!
    echo.
    echo 📁 Expected location: dist\win-unpacked\Gods Eye.exe
    echo.
    echo 🔧 To rebuild the application:
    echo  1. Open PowerShell in this directory
    echo  2. Run: npm run pack
    echo  3. Wait for build to complete
    echo  4. Run this launcher again
    echo.
    pause
    exit /b 1
)

echo 🎊 Launch completed!
echo.
echo 💡 Tips:
echo  - Application runs in fullscreen (kiosk mode)
echo  - Login with email and OTP to access features
echo  - Contact admin if you need to exit the application
echo.
echo Press any key to close this launcher window...
pause >nul
