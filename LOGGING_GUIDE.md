# 📝 Gods-Eye Application - Complete Logging Guide

## 🎉 **SUCCESS! Your application has been rebuilt with enhanced logging!**

### 🚀 **How to Run Your Application**

#### **Option 1: Quick Launch (Recommended)**
Double-click: `launch-gods-eye.bat`
- Interactive menu with all options
- Easy access to logs and features

#### **Option 2: Direct Executable**
Navigate to: `dist\win-unpacked\Gods Eye.exe`
- Double-click to run directly
- Standalone application

#### **Option 3: System Installation**
Run: `dist\Gods Eye Setup 1.0.0.exe`
- Installs to Program Files
- Creates desktop shortcuts
- Uninstaller included

---

## 📊 **Logging System Features**

### **🗂️ Log Files Created:**
Your application now creates detailed logs in the backend directory:

1. **`error.log`** - All error messages and exceptions
2. **`combined.log`** - All log entries combined
3. **`app-events.log`** - Application startup/shutdown events
4. **`security.log`** - USB security monitoring events

### **📍 Log Locations:**
- **Development Mode**: `backend/logs/`
- **Executable Mode**: Inside the application's resources

### **🔍 Log Viewing Options:**

#### **API Endpoints (when app is running):**
- **List all logs**: `http://localhost:3001/api/logs/files`
- **View log content**: `http://localhost:3001/api/logs/content/{filename}`
- **Real-time log tail**: `http://localhost:3001/api/logs/tail/{filename}`
- **Log statistics**: `http://localhost:3001/api/logs/stats`
- **Clear logs**: `DELETE http://localhost:3001/api/logs/clear/{filename}`

#### **Example API Usage:**
```bash
# Get list of all log files
curl http://localhost:3001/api/logs/files

# View last 50 lines of error log
curl http://localhost:3001/api/logs/content/error.log?lines=50

# Get log statistics
curl http://localhost:3001/api/logs/stats
```

---

## 🛠️ **What Gets Logged:**

### **🚀 Application Events:**
- ✅ Startup/shutdown with system info
- ✅ Configuration loading
- ✅ Database connections
- ✅ Component initialization

### **🔐 Security Events:**
- ✅ USB device detection/removal
- ✅ Security violations
- ✅ Authentication attempts
- ✅ Access control events

### **📡 API Activity:**
- ✅ HTTP requests/responses
- ✅ Response times
- ✅ Error responses
- ✅ User agents and IPs

### **⚠️ Error Tracking:**
- ✅ Uncaught exceptions
- ✅ Database errors
- ✅ File operation failures
- ✅ Network errors

### **📈 Performance Metrics:**
- ✅ Operation durations
- ✅ Memory usage
- ✅ CPU metrics
- ✅ Database query times

---

## 🎯 **Troubleshooting with Logs:**

### **If Application Won't Start:**
1. Check `error.log` for startup errors
2. Look for port conflicts in logs
3. Verify database connection logs

### **If Features Don't Work:**
1. Check `combined.log` for component errors
2. Review API request logs
3. Look for missing dependencies

### **Security Issues:**
1. Check `security.log` for USB events
2. Review authentication logs
3. Monitor access violations

---

## 📋 **Current Build Status:**

✅ **Executable Created**: `dist\win-unpacked\Gods Eye.exe` (Running)
✅ **Installer Available**: `dist\Gods Eye Setup 1.0.0.exe`
✅ **Logging System**: Fully integrated and active
✅ **USB Security**: Monitoring enabled
✅ **API Endpoints**: All functional including log viewer
✅ **Frontend**: Built and optimized
✅ **Backend**: Enhanced with comprehensive logging

---

## 🖥️ **Application Features:**

### **Core Functionality:**
- 🖥️ Desktop monitoring interface
- 📊 Real-time data visualization
- 🔒 USB security monitoring
- 📝 Document processing (PDF, Word, Excel)
- 🤖 AI-powered chat assistance
- 🔐 OTP-based authentication

### **New Logging Features:**
- 📝 Structured JSON logging
- 🔍 Log viewer API
- 📊 Log statistics and analytics
- 🔄 Real-time log streaming
- 🧹 Log rotation and cleanup
- 📱 Component-specific logging

---

## 🎊 **Your Application is Ready!**

**Status**: ✅ **FULLY OPERATIONAL**

The Gods-Eye application has been successfully rebuilt with:
- Enhanced logging system
- Better error tracking
- Performance monitoring
- Security event logging
- API for log management

**To start using**: Double-click `launch-gods-eye.bat` and select option 1!

---

## 📞 **Support**

If you encounter any issues:
1. Check the logs using the API endpoints
2. Use the launcher menu option 3 to view logs
3. Review this guide for troubleshooting tips

**Happy monitoring! 🚀**
