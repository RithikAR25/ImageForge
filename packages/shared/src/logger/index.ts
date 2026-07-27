export interface Logger {
  debug(message: string, data?: Record<string, unknown>): void;
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, error?: unknown): void;
}

/* eslint-disable no-console */

declare let process: { env?: { NODE_ENV?: string } };

const isProduction = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';

export function createLogger(scope: string): Logger {
  const formatMessage = (level: string, message: string) => {
    const timestamp = new Date().toISOString();
    return `${timestamp} [${level}] [${scope}] ${message}`;
  };

  return {
    debug: (message, data) => {
      if (!isProduction) {
        console.debug(formatMessage('DEBUG', message), data ?? '');
      }
    },
    info: (message, data) => {
      console.info(formatMessage('INFO', message), data ?? '');
    },
    warn: (message, data) => {
      console.warn(formatMessage('WARN', message), data ?? '');
    },
    error: (message, error) => {
      console.error(formatMessage('ERROR', message), error ?? '');
    },
  };
}
