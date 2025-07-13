# PowerShell script to start Gods-Eye Hazard Detection System

Write-Host "🚀 Starting Gods-Eye Hazard Detection System..." -ForegroundColor Green

# Check if Ollama is installed
try {
    $null = Get-Command ollama -ErrorAction Stop
} catch {
    Write-Host "❌ Ollama is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   Download from https://ollama.ai/download" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Python is installed
try {
    $null = Get-Command python -ErrorAction Stop
} catch {
    Write-Host "❌ Python is not installed. Please install it first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Node.js is installed
try {
    $null = Get-Command node -ErrorAction Stop
} catch {
    Write-Host "❌ Node.js is not installed. Please install it first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "📦 Starting Ollama..." -ForegroundColor Cyan
Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Minimized

# Wait for Ollama to start
Write-Host "⏳ Waiting for Ollama to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if Mistral model is available
$ollamaList = ollama list 2>$null
if ($ollamaList -notmatch "mistral") {
    Write-Host "📥 Pulling Mistral model (this may take a few minutes)..." -ForegroundColor Yellow
    ollama pull mistral
}

Write-Host "🔧 Starting Backend API..." -ForegroundColor Cyan
Set-Location "ml-fraud-detection"

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
& "venv\Scripts\Activate.ps1"

# Install dependencies if needed
if (-not (Test-Path "venv\Lib\site-packages\fastapi")) {
    Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
    pip install fastapi uvicorn ollama pymongo python-dotenv
}

# Start backend
Start-Process -FilePath "uvicorn" -ArgumentList "app:app --reload --port 8000" -WindowStyle Minimized

# Wait for backend to start
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "🎨 Starting Frontend..." -ForegroundColor Cyan
Set-Location "..\frontend"

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor Yellow
    npm install
}

# Start frontend
Start-Process -FilePath "npm" -ArgumentList "run dev" -WindowStyle Minimized

Write-Host ""
Write-Host "✅ All services started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📦 Ollama: Running on default port" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 To test the system, run: node test-hazard-detection.js" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Red

# Function to cleanup on exit
function Cleanup {
    Write-Host ""
    Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
    Get-Process -Name "ollama" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "uvicorn" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "✅ All services stopped" -ForegroundColor Green
    exit 0
}

# Set up signal handlers
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

# Wait for user input
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Cleanup
} 