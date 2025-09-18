type Level = 'debug' | 'info' | 'warn' | 'error';

const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'production';

const allowLogs = process.env.NEXT_PUBLIC_ENABLE_LOGS === 'true';

function out(level: Level, ...args: unknown[]) {
  if (isTest || isProd || !allowLogs) return;
  console[level === 'debug' ? 'log' : level](...args);
}

export const logger = {
  debug: (...a: unknown[]) => out('debug', ...a),
  info: (...a: unknown[]) => out('info', ...a),
  warn: (...a: unknown[]) => out('warn', ...a),
  error: (...a: unknown[]) => out('error', ...a),
};
