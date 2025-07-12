@echo off
title Gods Eye Application Launcher
echo ==========================================
echo       Gods Eye Application Launcher
echo         Enhanced with Logging System
echo ==========================================
echo.

:menu
echo Please select an option:
echo.
echo [1] Run Gods Eye Executable (Recommended)
echo [2] Run in Development Mode
echo [3] View Application Logs
echo [4] Install Gods Eye (System-wide)
echo [5] Clean Build and Rebuild
echo [6] Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto run_exe
if "%choice%"=="2" goto run_dev
if "%choice%"=="3" goto view_logs
if "%choice%"=="4" goto install
if "%choice%"=="5" goto rebuild
if "%choice%"=="6" goto exit
echo Invalid choice. Please try again.
goto menu

:run_exe
echo.
echo Starting Gods Eye Executable...
echo Location: dist\win-unpacked\Gods Eye.exe
echo.
if exist "dist\win-unpacked\Gods Eye.exe" (
    cd "dist\win-unpacked"
    start "" "Gods Eye.exe"
    echo Gods Eye application launched successfully!
    echo.
    echo Features available:
    echo - Desktop monitoring interface
    echo - USB security monitoring
    echo - Comprehensive logging system
    echo - API endpoints for log viewing
    echo.
) else (
    echo ERROR: Executable not found!
    echo Please run option 5 to rebuild the application.
)
pause
goto menu

:run_dev
echo.
echo Starting Gods Eye in Development Mode...
echo This will start backend, frontend, and Electron...
echo Press Ctrl+C to stop all processes.
echo.
call npm run dev
pause
goto menu

:view_logs
echo.
echo Opening log directory...
if exist "backend\logs" (
    start "" "backend\logs"
    echo.
    echo Available log files:
    dir "backend\logs\*.log" /b
    echo.
    echo Log API endpoints (when app is running):
    echo - View logs: http://localhost:3001/api/logs/files
    echo - Log stats: http://localhost:3001/api/logs/stats
) else (
    echo No logs directory found. Run the application first to generate logs.
)
echo.
pause
goto menu

:install
echo.
echo Installing Gods Eye system-wide...
if exist "dist\Gods Eye Setup 1.0.0.exe" (
    start "" "dist\Gods Eye Setup 1.0.0.exe"
    echo Installation started! Follow the installer prompts.
) else (
    echo ERROR: Installer not found!
    echo Please run option 5 to rebuild the application.
)
pause
goto menu

:rebuild
echo.
echo Cleaning and rebuilding Gods Eye...
echo This may take a few minutes...
echo.

echo Cleaning old build...
if exist dist rmdir /s /q dist

echo Installing root dependencies...
call npm install

echo Installing frontend dependencies...
cd frontend && call npm install && cd ..

echo Installing backend dependencies...
cd backend && call npm install && cd ..

echo Building frontend...
call npm run build:frontend

echo Creating executable package...
call npm run pack

echo Creating installer...
call npm run dist

echo.
echo Build completed successfully!
echo - Executable: dist\win-unpacked\Gods Eye.exe
echo - Installer: dist\Gods Eye Setup 1.0.0.exe
echo.
pause
goto menu

:exit
echo.
echo Thank you for using Gods Eye!
echo.
exit

:error
echo.
echo An error occurred. Please check the above messages.
pause
goto menu
