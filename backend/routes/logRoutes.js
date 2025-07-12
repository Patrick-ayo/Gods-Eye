const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { createComponentLogger } = require('../utils/logger');

const loggerAPI = createComponentLogger('LOG_API');

// Get list of available log files
router.get('/files', (req, res) => {
    try {
        const logsDir = path.join(__dirname, '..', 'logs');
        
        if (!fs.existsSync(logsDir)) {
            return res.json({ files: [] });
        }
        
        const files = fs.readdirSync(logsDir)
            .filter(file => file.endsWith('.log'))
            .map(file => {
                const filePath = path.join(logsDir, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    size: stats.size,
                    modified: stats.mtime,
                    sizeFormatted: formatBytes(stats.size)
                };
            })
            .sort((a, b) => b.modified - a.modified);
        
        loggerAPI.info('Log files requested', { filesCount: files.length });
        res.json({ files });
    } catch (error) {
        loggerAPI.error('Error reading log files', { error: error.message });
        res.status(500).json({ error: 'Failed to read log files' });
    }
});

// Get log file content
router.get('/content/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const { lines = 100, offset = 0 } = req.query;
        
        // Validate filename (security check)
        if (!filename.endsWith('.log') || filename.includes('..')) {
            return res.status(400).json({ error: 'Invalid filename' });
        }
        
        const filePath = path.join(__dirname, '..', 'logs', filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Log file not found' });
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const allLines = content.split('\n').filter(line => line.trim());
        
        const startIndex = Math.max(0, allLines.length - parseInt(lines) - parseInt(offset));
        const endIndex = allLines.length - parseInt(offset);
        const requestedLines = allLines.slice(startIndex, endIndex);
        
        // Parse JSON lines for better formatting
        const parsedLines = requestedLines.map((line, index) => {
            try {
                const parsed = JSON.parse(line);
                return {
                    index: startIndex + index,
                    timestamp: parsed.timestamp,
                    level: parsed.level,
                    message: parsed.message,
                    component: parsed.component,
                    meta: parsed,
                    raw: line
                };
            } catch (e) {
                return {
                    index: startIndex + index,
                    timestamp: new Date().toISOString(),
                    level: 'info',
                    message: line,
                    component: 'unknown',
                    meta: {},
                    raw: line
                };
            }
        });
        
        loggerAPI.info('Log content requested', { 
            filename, 
            linesRequested: lines, 
            linesReturned: parsedLines.length 
        });
        
        res.json({
            filename,
            totalLines: allLines.length,
            returnedLines: parsedLines.length,
            lines: parsedLines
        });
        
    } catch (error) {
        loggerAPI.error('Error reading log content', { 
            filename: req.params.filename, 
            error: error.message 
        });
        res.status(500).json({ error: 'Failed to read log content' });
    }
});

// Get real-time log tail
router.get('/tail/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        
        // Validate filename
        if (!filename.endsWith('.log') || filename.includes('..')) {
            return res.status(400).json({ error: 'Invalid filename' });
        }
        
        const filePath = path.join(__dirname, '..', 'logs', filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Log file not found' });
        }
        
        // Set up Server-Sent Events
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });
        
        // Watch file for changes
        const watcher = fs.watchFile(filePath, { interval: 1000 }, (curr, prev) => {
            if (curr.mtime > prev.mtime) {
                // File was modified, send new content
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const lines = content.split('\n').filter(line => line.trim());
                    const lastLine = lines[lines.length - 1];
                    
                    if (lastLine) {
                        res.write(`data: ${JSON.stringify({ line: lastLine, timestamp: new Date().toISOString() })}\n\n`);
                    }
                } catch (error) {
                    res.write(`data: ${JSON.stringify({ error: 'Failed to read file' })}\n\n`);
                }
            }
        });
        
        // Clean up on client disconnect
        req.on('close', () => {
            fs.unwatchFile(filePath);
            loggerAPI.info('Log tail connection closed', { filename });
        });
        
        loggerAPI.info('Log tail started', { filename });
        
    } catch (error) {
        loggerAPI.error('Error setting up log tail', { 
            filename: req.params.filename, 
            error: error.message 
        });
        res.status(500).json({ error: 'Failed to set up log tail' });
    }
});

// Get log statistics
router.get('/stats', (req, res) => {
    try {
        const logsDir = path.join(__dirname, '..', 'logs');
        
        if (!fs.existsSync(logsDir)) {
            return res.json({ stats: {} });
        }
        
        const files = fs.readdirSync(logsDir).filter(file => file.endsWith('.log'));
        const stats = {};
        
        files.forEach(file => {
            const filePath = path.join(logsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n').filter(line => line.trim());
            
            let errorCount = 0;
            let warnCount = 0;
            let infoCount = 0;
            
            lines.forEach(line => {
                try {
                    const parsed = JSON.parse(line);
                    switch (parsed.level) {
                        case 'error': errorCount++; break;
                        case 'warn': warnCount++; break;
                        case 'info': infoCount++; break;
                    }
                } catch (e) {
                    // Ignore parsing errors
                }
            });
            
            stats[file] = {
                totalLines: lines.length,
                errorCount,
                warnCount,
                infoCount,
                size: fs.statSync(filePath).size,
                sizeFormatted: formatBytes(fs.statSync(filePath).size)
            };
        });
        
        loggerAPI.info('Log statistics requested');
        res.json({ stats });
        
    } catch (error) {
        loggerAPI.error('Error generating log statistics', { error: error.message });
        res.status(500).json({ error: 'Failed to generate log statistics' });
    }
});

// Clear log file
router.delete('/clear/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        
        // Validate filename
        if (!filename.endsWith('.log') || filename.includes('..')) {
            return res.status(400).json({ error: 'Invalid filename' });
        }
        
        const filePath = path.join(__dirname, '..', 'logs', filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Log file not found' });
        }
        
        // Clear file content
        fs.writeFileSync(filePath, '');
        
        loggerAPI.info('Log file cleared', { filename });
        res.json({ message: `Log file ${filename} cleared successfully` });
        
    } catch (error) {
        loggerAPI.error('Error clearing log file', { 
            filename: req.params.filename, 
            error: error.message 
        });
        res.status(500).json({ error: 'Failed to clear log file' });
    }
});

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = router;
