import LogRocket from '@logrocket/react-native';

/* eslint-disable @typescript-eslint/no-explicit-any */
class LogService {
  static log(message: string, data?: Record<string, any>) {
    console.log(message, data);
  }

  static trackIssue(
    context: string,
    error: any,
    level: 'error' | 'warn' | 'info' | 'debug' | 'verbose' | 'silly' = 'error',
    data?: {[key: string]: string | number | boolean},
  ) {
    try {
      const message: string =
        (typeof error?.message === 'string' && error.message) ||
        (typeof error === 'string' ? error : 'Unknown error');

      const logTitle = `${context} ${level.toUpperCase()}:`;
      if (level === 'error') {
        console.error(logTitle, error);
      } else if (level === 'warn') {
        console.warn(logTitle, error);
      } else {
        console.log(logTitle, error);
      }

      LogRocket.captureMessage(message, {
        tags: {
          level,
          context,
        },
        extra: data,
      });
    } catch (_error) {
      console.error('LogService.error', _error);
    }
  }

  static warn(context: string, message: string, data?: Record<string, any>) {
    console.warn(message, data);
  }
}

export default LogService;
