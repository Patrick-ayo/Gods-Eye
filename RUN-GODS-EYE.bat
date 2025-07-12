@echo off
title Launch Gods Eye Application
echo ==========================================
echo        Gods Eye Application
echo      Ready to Launch (Fixed Version)
echo ==========================================
echo.

echo Starting Gods Eye application...
echo Location: dist\win-unpacked\Gods Eye.exe
echo.

if exist "dist\win-unpacked\Gods Eye.exe" (
    echo ✅ Executable found!
    echo 🚀 Launching Gods Eye...
    echo.
    
    cd "dist\win-unpacked"
    start "" "Gods Eye.exe"
    
echo ✅ Gods Eye launched successfully!
    echo.
    echo 📋 Expected behavior:
    echo  - Window should open with Login screen
    echo  - Enter email and click Login
    echo  - Enter OTP verification code
    echo  - Access main monitoring interface
    echo.
    echo 🔧 If you see a blank screen:
    echo  - DevTools will open automatically for debugging
    echo  - Check console for errors
    echo  - Look for "Failed to load" messages
    echo.
    echo 📝 Technical details:
    echo  - Backend API: http://localhost:3001
    echo  - Log viewer: http://localhost:3001/api/logs/files
    echo  - Frontend loads from: dist\win-unpacked\resources\app.asar
    echo.
    echo ⚠️  Note: Application will auto-shutdown if USB storage detected
    echo.
) else (
    echo ❌ ERROR: Gods Eye executable not found!
    echo.
    echo 🔧 To rebuild the application:
    echo 1. Open PowerShell in this directory
    echo 2. Run: npm run pack
    echo 3. Wait for build to complete
    echo 4. Run this script again
    echo.
)

echo Press any key to close this window...
pause >nul
