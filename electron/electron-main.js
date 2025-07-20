// electron-main.js
const { app, BrowserWindow, Menu, ipcMain, powerMonitor } = require("electron");
const path = require("path");
const { fork } = require("child_process");
const os = require("os");
const { exec } = require("child_process");

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    // Normal Window Configuration
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
    },
    icon: path.join(__dirname, "assets", "icon.png"),
    show: false,
  });

  // Show window when ready to prevent visual flash
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Add error handling for loading failures
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorDescription, 'URL:', validatedURL);
    mainWindow.webContents.openDevTools();
  });

  // Log when page loads successfully
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
  });

  // Load the React app
  if (process.env.NODE_ENV === "development") {
    // Development: Load from Vite dev server
    mainWindow.loadURL("http://localhost:5173");
    // Open DevTools in development only
    mainWindow.webContents.openDevTools();
  } else {
    // Production: Load from built files
    console.log('Loading Gods Eye Application');
    console.log('App packaged status:', app.isPackaged);
    console.log('Process resourcesPath:', process.resourcesPath);
    console.log('__dirname:', __dirname);
    
    // Always load from the same relative path in production
    const filePath = path.join(__dirname, "..", "frontend", "dist", "index.html");
    console.log('Loading frontend from:', filePath);
    
    mainWindow.loadFile(filePath).catch((error) => {
      console.error('Failed to load frontend:', error);
      // Fallback: show error
      mainWindow.loadURL('data:text/html,<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial;font-size:24px;color:red;"><div><h1>Gods Eye - Loading Error</h1><p>Please contact administrator</p><p>Error: Failed to load application</p></div></div>');
    });
  }

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    return { action: "deny" };
  });
}

function createMenu() {
  // Normal application menu
  const template = [
    {
      label: "Gods Eye",
      submenu: [
        {
          label: "About Gods Eye",
          click: () => {
            // Show about dialog
            mainWindow.webContents.executeJavaScript(`
              alert('Gods Eye Monitoring System\\nVersion 1.0.0');
            `);
          },
        },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Toggle Developer Tools",
          accelerator: "F12",
          click: () => {
            mainWindow.webContents.toggleDevTools();
          },
        },
        {
          label: "Reload",
          accelerator: "Ctrl+R",
          click: () => {
            mainWindow.webContents.reload();
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function startBackend() {
  // Start the backend as a child process
  const isDev = !app.isPackaged;
  let backendPath, backendCwd;
  
  if (isDev) {
    backendPath = path.join(__dirname, "..", "backend", "app.js");
    backendCwd = path.join(__dirname, "..", "backend");
  } else {
    // When packaged, backend is in resources directory
    backendPath = path.join(process.resourcesPath, "backend", "app.js");
    backendCwd = path.join(process.resourcesPath, "backend");
  }
  
  console.log('Backend path:', backendPath);
  console.log('Backend cwd:', backendCwd);

  try {
    backendProcess = fork(backendPath, [], {
      silent: true,
      cwd: backendCwd,
    });

    backendProcess.stdout.on("data", (data) => {
      console.log(`Backend stdout: ${data}`);
    });

    backendProcess.stderr.on("data", (data) => {
      console.error(`Backend stderr: ${data}`);
    });

    backendProcess.on("close", (code) => {
      console.log(`Backend process exited with code ${code}`);
    });

    backendProcess.on("error", (error) => {
      console.error("Backend process error:", error);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
  }
}

app.whenReady().then(() => {
  console.log('Starting Gods Eye Application');
  
  createMenu();
  startBackend();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  // Kill the backend process before quitting the app
  if (backendProcess) {
    console.log("Killing backend process...");
    backendProcess.kill();
  }
});

// IPC Handlers for system information
ipcMain.handle('get-battery-info', async () => {
  try {
    return new Promise((resolve, reject) => {
      // For Windows, use PowerShell to get battery info
      const command = 'powershell -Command "Get-WmiObject -Class Win32_Battery | Select-Object EstimatedChargeRemaining, BatteryStatus | ConvertTo-Json"';
      
      exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
        if (error) {
          console.error('Battery info error:', error);
          resolve({ level: null, charging: null, supported: false });
          return;
        }
        
        try {
          const batteryData = JSON.parse(stdout.trim());
          const isCharging = batteryData.BatteryStatus === 2; // 2 = charging
          const level = batteryData.EstimatedChargeRemaining;
          
          resolve({
            level: level,
            charging: isCharging,
            supported: true
          });
        } catch (parseError) {
          console.error('Battery parse error:', parseError);
          resolve({ level: null, charging: null, supported: false });
        }
      });
    });
  } catch (error) {
    console.error('Battery API error:', error);
    return { level: null, charging: null, supported: false };
  }
});

ipcMain.handle('get-system-info', async () => {
  try {
    return new Promise((resolve) => {
      // Get system information
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memUsagePercent = Math.round((usedMem / totalMem) * 100);
      
      // For Windows, get CPU usage via PowerShell
      const command = 'powershell -Command "Get-Counter \\Processor(_Total)\\% Processor Time | Select-Object -ExpandProperty CounterSamples | Select-Object CookedValue"';
      
      exec(command, { timeout: 3000 }, (error, stdout) => {
        let cpuUsage = null;
        
        if (!error) {
          try {
            const match = stdout.match(/([0-9.]+)/);
            if (match) {
              cpuUsage = Math.round(parseFloat(match[1]));
            }
          } catch (parseError) {
            console.warn('CPU usage parse error:', parseError);
          }
        }
        
        resolve({
          cpu: cpuUsage,
          memory: {
            used: usedMem,
            total: totalMem,
            free: freeMem,
            usagePercent: memUsagePercent
          },
          platform: os.platform(),
          arch: os.arch(),
          supported: true
        });
      });
    });
  } catch (error) {
    console.error('System info error:', error);
    return {
      cpu: null,
      memory: null,
      platform: os.platform(),
      arch: os.arch(),
      supported: false
    };
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
