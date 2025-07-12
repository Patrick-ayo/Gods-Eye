@echo off
title Gods Eye - Kiosk Mode Launcher
echo ==========================================
echo       Gods Eye - Kiosk Mode Launcher
echo           Full Screen Monitoring
echo ==========================================
echo.

echo 🖥️ Preparing Kiosk Mode Environment...
echo.

REM Kill any existing instances first
echo Terminating any running instances...
taskkill /IM "Gods Eye.exe" /F >nul 2>&1

REM Disable Windows key (requires admin rights)
echo Attempting to disable Windows key for kiosk mode...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Keyboard Layout" /v "Scancode Map" /t REG_BINARY /d 00000000000000000300000000005BE000005CE000000000 /f >nul 2>&1

echo.
echo 🚀 Starting Gods Eye in Kiosk Mode...
echo.
echo ⚠️  KIOSK MODE FEATURES:
echo  ✅ Full screen - no window controls
echo  ✅ Always on top
echo  ✅ Disabled keyboard shortcuts
echo  ✅ No right-click menu
echo  ✅ No taskbar access
echo  ✅ Single instance only
echo.
echo 🔐 EXIT METHODS:
echo  - Admin Exit: Ctrl+Shift+Alt+Q
echo  - System Exit: Ctrl+Alt+Del (Windows Security)
echo  - Process Kill: Task Manager (if accessible)
echo.

if exist "dist\win-unpacked\Gods Eye.exe" (
    echo ✅ Starting Gods Eye Kiosk Application...
    cd "dist\win-unpacked"
    
    REM Start in kiosk mode
    start "" "Gods Eye.exe"
    
    echo.
    echo 🎯 Gods Eye is now running in Kiosk Mode!
    echo.
    echo 📋 User Experience:
    echo  - Full screen monitoring interface
    echo  - Login screen → OTP → Dashboard
    echo  - USB security monitoring active
    echo  - All system functions restricted
    echo.
    echo ⚠️  To exit kiosk mode:
    echo  1. Press Ctrl+Shift+Alt+Q (Admin Exit)
    echo  2. Or use Ctrl+Alt+Del → Task Manager
    echo.
    
    REM Wait and monitor the process
    echo 🔍 Monitoring kiosk application...
    timeout /t 5 >nul
    
    REM Check if application is still running
    tasklist | findstr "Gods Eye.exe" >nul
    if %errorlevel% equ 0 (
        echo ✅ Kiosk mode active - Gods Eye is running
    ) else (
        echo ❌ Application failed to start properly
        pause
        exit /b 1
    )
    
) else (
    echo ❌ ERROR: Gods Eye executable not found!
    echo.
    echo 🔧 To build the kiosk application:
    echo 1. Open PowerShell as Administrator
    echo 2. Navigate to this directory
    echo 3. Run: npm run pack
    echo 4. Wait for build to complete
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

echo.
echo 🎊 Kiosk Mode Successfully Activated!
echo.
echo 📞 For support or issues:
echo  - Check logs: backend\logs\
echo  - API status: http://localhost:3001/api/health
echo.
echo Press any key to minimize this window...
pause >nul

REM Minimize this window so it doesn't interfere with kiosk mode
powershell -command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\"user32.dll\")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow); }'; [Win32]::ShowWindow((Get-Process -Id $PID).MainWindowHandle, 6)"
