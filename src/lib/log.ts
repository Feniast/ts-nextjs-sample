import log, { Logger } from 'loglevel';
import { DEBUG } from './config';
import { formatDate } from './util';

if (process.env.NODE_ENV === 'production') {
  log.setLevel('error');
} else {
  log.setLevel('debug');
}

export default log;

type LogLevelMethodKey = 'trace' | 'debug' | 'info' | 'warn' | 'error';

export const createLogger = (prefix: string, { timestamp = true } = {}) => {
  const logger = log.getLogger(prefix);
  return ([
    'trace',
    'debug',
    'info',
    'warn',
    'error',
  ] as LogLevelMethodKey[]).reduce((o: Partial<Logger>, l) => {
    o[l] = (...msg: any) => {
      const args = timestamp
        ? [formatDate(new Date(), 'HH:mm:ss'), prefix, ...msg]
        : [prefix, ...msg];
      logger[l](...args);
    };
    return o;
  }, {});
};

export const debugLogger = (prefix: string, { timestamp = true } = {}) => {
  const logger = log.getLogger(prefix);
  logger.setLevel('debug');
  if (!DEBUG) return () => {};
  return (...msg: any) => {
    const args = timestamp
      ? [formatDate(new Date(), 'HH:mm:ss'), prefix, ...msg]
      : [prefix, ...msg];
    logger.debug(...args);
  };
};
