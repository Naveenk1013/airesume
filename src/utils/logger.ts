/**
 * Production-safe logger utility
 * Only logs to console in development mode
 * Can be extended to use external monitoring services in production
 */

const isDev = import.meta.env.DEV;

interface Logger {
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    info: (...args: any[]) => void;
    debug: (...args: any[]) => void;
}

/**
 * Logger that only outputs in development mode
 * In production, logs are silently ignored (or can be sent to monitoring service)
 */
export const logger: Logger = {
    log: (...args: any[]) => {
        if (isDev) {
            console.log(...args);
        }
        // Production: could send to monitoring service like Sentry, LogRocket, etc.
    },

    warn: (...args: any[]) => {
        if (isDev) {
            console.warn(...args);
        }
        // Production: could send warnings to monitoring
    },

    error: (...args: any[]) => {
        // Always log errors, but could also send to monitoring
        if (isDev) {
            console.error(...args);
        }
        // Production: send to error monitoring service
        // Example: Sentry.captureException(args[0]);
    },

    info: (...args: any[]) => {
        if (isDev) {
            console.info(...args);
        }
    },

    debug: (...args: any[]) => {
        if (isDev) {
            console.debug(...args);
        }
    },
};

export default logger;
