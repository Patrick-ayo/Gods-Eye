const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for console output
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        const serviceStr = service ? `[${service}]` : '';
        return `${timestamp} ${level}${serviceStr}: ${message}${metaStr}`;
    })
);

// Custom format for file output
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: fileFormat,
    defaultMeta: { service: 'gods-eye-backend' },
    transports: [
        // Error log file
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            format: fileFormat
        }),
        
        // Combined log file
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            format: fileFormat
        }),
        
        // Application events log
        new winston.transports.File({
            filename: path.join(logsDir, 'app-events.log'),
            level: 'info',
            maxsize: 5242880, // 5MB
            maxFiles: 3,
            format: fileFormat
        }),
        
        // Security events log
        new winston.transports.File({
            filename: path.join(logsDir, 'security.log'),
            level: 'warn',
            maxsize: 5242880, // 5MB
            maxFiles: 10,
            format: fileFormat
        })
    ]
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

// Create specialized loggers for different components
const createComponentLogger = (component) => {
    return {
        info: (message, meta = {}) => logger.info(message, { component, ...meta }),
        warn: (message, meta = {}) => logger.warn(message, { component, ...meta }),
        error: (message, meta = {}) => logger.error(message, { component, ...meta }),
        debug: (message, meta = {}) => logger.debug(message, { component, ...meta }),
        security: (message, meta = {}) => logger.warn(message, { component, type: 'SECURITY', ...meta })
    };
};

// Application startup logger
const logAppStart = () => {
    logger.info('🚀 Gods Eye Backend Starting', {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        environment: process.env.NODE_ENV || 'development'
    });
};

// Application shutdown logger
const logAppShutdown = (reason = 'Normal shutdown') => {
    logger.info('🛑 Gods Eye Backend Shutting Down', {
        reason,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
};

// USB Security event logger
const logUSBEvent = (event, device = {}) => {
    logger.warn('🔒 USB Security Event', {
        event,
        device,
        timestamp: new Date().toISOString(),
        type: 'USB_SECURITY'
    });
};

// API request logger middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
        };
        
        if (res.statusCode >= 400) {
            logger.error('API Request Error', logData);
        } else {
            logger.info('API Request', logData);
        }
    });
    
    next();
};

// Error logger middleware
const errorLogger = (err, req, res, next) => {
    logger.error('Application Error', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    next(err);
};

// Performance logger
const logPerformance = (operation, duration, metadata = {}) => {
    logger.info('Performance Metric', {
        operation,
        duration,
        ...metadata,
        timestamp: new Date().toISOString()
    });
};

// Database operation logger
const logDatabaseOperation = (operation, collection, result, error = null) => {
    if (error) {
        logger.error('Database Error', {
            operation,
            collection,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    } else {
        logger.info('Database Operation', {
            operation,
            collection,
            result: result ? 'success' : 'no results',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = {
    logger,
    createComponentLogger,
    logAppStart,
    logAppShutdown,
    logUSBEvent,
    requestLogger,
    errorLogger,
    logPerformance,
    logDatabaseOperation
};
