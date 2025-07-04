#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Gods Eye Development Environment...\n');

// Function to start a process
function startProcess(name, command, args, cwd) {
  console.log(`📦 Starting ${name}...`);
  
  const process = spawn(command, args, {
    cwd: cwd || process.cwd(),
    stdio: 'inherit',
    shell: true
  });

  process.on('error', (error) => {
    console.error(`❌ Error starting ${name}:`, error.message);
  });

  process.on('close', (code) => {
    console.log(`📦 ${name} exited with code ${code}`);
  });

  return process;
}

// Start backend
const backend = startProcess('Backend', 'npm', ['start'], path.join(process.cwd(), 'backend'));

// Wait a bit for backend to start
setTimeout(() => {
  // Start frontend
  const frontend = startProcess('Frontend', 'npm', ['run', 'dev'], path.join(process.cwd(), 'frontend'));
  
  // Wait for frontend to be ready
  setTimeout(() => {
    console.log('⚡ Starting Electron...');
    const electron = startProcess('Electron', 'npm', ['run', 'dev:electron']);
    
    // Handle cleanup
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down development environment...');
      backend.kill();
      frontend.kill();
      electron.kill();
      process.exit(0);
    });
  }, 3000);
}, 2000);

console.log('💡 Press Ctrl+C to stop all processes\n'); 