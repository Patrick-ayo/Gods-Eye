@echo off
echo 🚀 Starting Gods-Eye Hazard Detection System...

REM Check if Ollama is installed
where ollama >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Ollama is not installed. Please install it first:
    echo    Download from https://ollama.ai/download
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install it first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install it first.
    pause
    exit /b 1
)

echo 📦 Starting Ollama...
start "Ollama" ollama serve

REM Wait for Ollama to start
echo ⏳ Waiting for Ollama to start...
timeout /t 5 /nobreak >nul

REM Check if Mistral model is available
ollama list | findstr "mistral" >nul
if %errorlevel% neq 0 (
    echo 📥 Pulling Mistral model (this may take a few minutes)...
    ollama pull mistral
)

echo 🔧 Starting Backend API...
cd ml-fraud-detection

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies if needed
if not exist "venv\Lib\site-packages\fastapi" (
    echo 📦 Installing Python dependencies...
    pip install fastapi uvicorn ollama pymongo python-dotenv
)

REM Start backend
start "Backend" uvicorn app:app --reload --port 8000

REM Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo 🎨 Starting Frontend...
cd ..\frontend

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing Node.js dependencies...
    npm install
)

REM Start frontend
start "Frontend" npm run dev

echo.
echo ✅ All services started successfully!
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend API: http://localhost:8000
echo 📦 Ollama: Running on default port
echo.
echo 🧪 To test the system, run: node test-hazard-detection.js
echo.
echo Press any key to stop all services...
pause >nul

echo 🛑 Stopping all services...
taskkill /f /im "ollama.exe" >nul 2>nul
taskkill /f /im "uvicorn.exe" >nul 2>nul
taskkill /f /im "node.exe" >nul 2>nul
echo ✅ All services stopped 