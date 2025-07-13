# 🚀 Complete Setup Guide - Hazard Detection System

This guide will walk you through setting up and running the entire hazard detection system step by step.

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **Ollama** installed and running
- **MongoDB** (optional, for logging)

## 🔧 Step 1: Install Ollama and Mistral Model

### Install Ollama
```bash
# Windows (using winget)
winget install Ollama.Ollama

# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh
```

### Start Ollama and Pull Mistral Model
```bash
# Start Ollama service
ollama serve

# In a new terminal, pull the Mistral model
ollama pull mistral
```

## 🔧 Step 2: Setup Backend (Hazard Detection API)

### Navigate to Backend Directory
```bash
cd Gods-Eye/ml-fraud-detection
```

### Install Python Dependencies
```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install required packages
pip install fastapi uvicorn ollama pymongo python-dotenv
```

### Create Environment File (Optional)
```bash
# Create .env file for MongoDB connection (optional)
echo "MONGO_URI=mongodb://localhost:27017" > .env
echo "CLOUDINARY_API_KEY=your_key_here" >> .env
```

### Start the Backend Server
```bash
# Start the FastAPI server
uvicorn app:app --reload --port 8000

# You should see output like:
# INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
# INFO:     Started reloader process [xxxxx] using StatReload
# INFO:     Started server process [xxxxx]
# INFO:     Waiting for application startup.
# INFO:     Application startup complete.
```

## 🔧 Step 3: Setup Frontend (React App)

### Open a New Terminal Window
Keep the backend running and open a new terminal.

### Navigate to Frontend Directory
```bash
cd Gods-Eye/frontend
```

### Install Node.js Dependencies
```bash
# Install all required packages
npm install

# If you get any errors, try:
npm install --force
```

### Start the Frontend Development Server
```bash
# Start the React development server
npm run dev

# You should see output like:
# VITE v4.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
```

## 🧪 Step 4: Test the System

### Test the Backend API
Open a new terminal and run the test script:

```bash
# Navigate to the main directory
cd Gods-Eye

# Run the test script
node test-hazard-detection.js

# Expected output:
# 🧪 Testing Hazard Detection API...
# 🟢 SAFE | "Hello, how are you?"
# 🔴 CONFIDENTIAL | "The password is admin123"
# 🔴 CONFIDENTIAL | "API key: sk-1234567890abcdef"
# ...
# ✅ Test completed!
```

### Test the Frontend
1. Open your browser and go to: `http://localhost:5173/`
2. You should see the Gods-Eye chat interface
3. Start typing messages to test real-time detection:
   - Type: "Hello, how are you?" → Should show green "✓ Message is safe"
   - Type: "The password is admin123" → Should show red "⚠️ This message is confidential"
   - Send the message → Should appear in red with warning tag in chat

## 🔧 Step 5: Verify All Services Are Running

### Check Running Services
You should have these running simultaneously:

1. **Ollama Service** (Terminal 1):
   ```bash
   ollama serve
   ```

2. **Backend API** (Terminal 2):
   ```bash
   cd Gods-Eye/ml-fraud-detection
   uvicorn app:app --reload --port 8000
   ```

3. **Frontend App** (Terminal 3):
   ```bash
   cd Gods-Eye/frontend
   npm run dev
   ```

### Verify API Endpoints
Test the API endpoints directly:

```bash
# Test the /detect endpoint
curl -X POST http://localhost:8000/detect \
  -H "Content-Type: application/json" \
  -d '{"message": "The password is admin123"}'

# Expected response:
# {"result": "CONFIDENTIAL"}

# Test the /check-hazard endpoint
curl -X POST http://localhost:8000/check-hazard \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello world", "sender": "test"}'

# Expected response:
# {"result": "SAFE"}
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Ollama Not Found
```bash
# Error: 'ollama' is not recognized
# Solution: Install Ollama properly
# Windows: Download from https://ollama.ai/download
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.ai/install.sh | sh
```

#### 2. Port Already in Use
```bash
# Error: Address already in use
# Solution: Use different ports
uvicorn app:app --reload --port 8001  # Backend
npm run dev -- --port 3000            # Frontend
```

#### 3. Python Dependencies Missing
```bash
# Error: ModuleNotFoundError
# Solution: Install missing packages
pip install fastapi uvicorn ollama pymongo python-dotenv
```

#### 4. Node.js Dependencies Missing
```bash
# Error: Cannot find module
# Solution: Install dependencies
cd Gods-Eye/frontend
npm install
```

#### 5. CORS Issues
```bash
# Error: CORS policy blocked
# Solution: Backend already has CORS configured
# If issues persist, check that backend is running on port 8000
```

#### 6. API Connection Failed
```bash
# Error: Failed to fetch
# Solution: Check that backend is running
# Verify: http://localhost:8000/detect is accessible
```

### Debug Commands

#### Check Ollama Status
```bash
# Check if Ollama is running
ollama list

# Should show:
# NAME    ID          SIZE   MODIFIED
# mistral xxxxxxxxxx  4.7GB  xxxxxxxx
```

#### Check Backend Logs
```bash
# Look for errors in backend terminal
# Common issues: Ollama not running, model not found
```

#### Check Frontend Console
```bash
# Open browser developer tools (F12)
# Check Console tab for JavaScript errors
# Check Network tab for API call failures
```

## 📱 Usage Instructions

### Using the Hazard Detection System

1. **Start Typing**: Begin typing any message in the chat input
2. **Real-time Detection**: After 1 second of no typing, the system will analyze your message
3. **Visual Feedback**: 
   - Green indicator = Safe message
   - Red indicator = Confidential message
4. **Send Message**: Click send to add the message to chat history
5. **Chat History**: Confidential messages appear in red with warning tags

### Test Messages to Try

**Safe Messages:**
- "Hello, how are you?"
- "Meeting at 3 PM today"
- "Weather is nice today"
- "Let's grab lunch"

**Confidential Messages:**
- "The password is admin123"
- "API key: sk-1234567890abcdef"
- "Internal project codename: Project Phoenix"
- "Database credentials: user=admin, pass=secret123"
- "HR file contains employee salaries"
- "Client database URI: mongodb://localhost:27017"

## 🔄 Quick Start Script

Create a quick start script for easy setup:

```bash
# Create start-all.sh (Linux/macOS) or start-all.bat (Windows)

# Linux/macOS (start-all.sh):
#!/bin/bash
echo "🚀 Starting Gods-Eye Hazard Detection System..."

# Start Ollama
echo "📦 Starting Ollama..."
ollama serve &

# Wait for Ollama to start
sleep 3

# Start Backend
echo "🔧 Starting Backend API..."
cd ml-fraud-detection
uvicorn app:app --reload --port 8000 &

# Wait for backend to start
sleep 3

# Start Frontend
echo "🎨 Starting Frontend..."
cd ../frontend
npm run dev

# Windows (start-all.bat):
@echo off
echo 🚀 Starting Gods-Eye Hazard Detection System...

echo 📦 Starting Ollama...
start "Ollama" ollama serve

timeout /t 3

echo 🔧 Starting Backend API...
cd ml-fraud-detection
start "Backend" uvicorn app:app --reload --port 8000

timeout /t 3

echo 🎨 Starting Frontend...
cd ../frontend
npm run dev
```

## ✅ Success Checklist

- [ ] Ollama is running with Mistral model
- [ ] Backend API is accessible at http://localhost:8000
- [ ] Frontend app is running at http://localhost:5173
- [ ] Test script shows both SAFE and CONFIDENTIAL results
- [ ] Real-time detection works while typing
- [ ] Confidential messages appear in red with warning tags
- [ ] All existing chat functionality still works

## 🆘 Getting Help

If you encounter issues:

1. **Check the console logs** in all terminal windows
2. **Verify all services are running** (Ollama, Backend, Frontend)
3. **Test API endpoints** using curl or the test script
4. **Check browser developer tools** for frontend errors
5. **Review the troubleshooting section** above

The system is now ready to protect your chat from confidential information leaks! 🛡️ 