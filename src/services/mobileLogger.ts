import axios from 'axios';
import { Platform } from 'react-native';
import { publicService } from './backend/publicService';
import { userType } from './backend/backendApi';
import { customerService } from './backend/customerService';

type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

function serializeError(err: unknown) {
  if (!err) return { message: 'Unknown error' };

  // Axios error
  if (typeof err === 'object' && err !== null && 'isAxiosError' in (err as any)) {
    const a = err as any;
    return {
      message: a.message,
      name: a.name,
      status: a.response?.status,
      responseData: a.response?.data,
      request: !!a.request,
      config: a.config,
      stack: a.stack,
    };
  }

  if (err instanceof Error) {
    return {
      message: err.message,
      name: err.name,
      stack: err.stack,
      // include enumerable custom props
      ...Object.fromEntries(
        Object.entries(err).filter(([k]) => !['message', 'name', 'stack'].includes(k))
      ),
    };
  }

  try {
    return { message: typeof err === 'string' ? err : JSON.stringify(err) };
  } catch {
    return { message: 'Unserializable error' };
  }
}

async function sendLog(opts: {
  qrCode: string;
  level: LogLevel;
  page: string;
  message: string;
  json?: any;
}) {
  const { qrCode, level, page, message, json } = opts;

  const payload = {
    level,
    platform: Platform.OS,
    page,
    message,
    json,
    timestamp: new Date().toISOString(),
  };

  try {
    // fire-and-forget, but return the promise so callers can await if they want
    return publicService.sendMobileLogs(qrCode, payload);
  } catch (err) {
    // Avoid throwing from logger. Best-effort log only.
    // eslint-disable-next-line no-console
    console.warn('mobileLogger: failed to send log', err);
  }
}

async function sendAuthenticatedLog(opts: {
  userType: userType;
  level: LogLevel;
  page: string;
  message: string;
  json?: any;
}) {
  const { userType, level, page, message, json } = opts;

  const payload = {
    level,
    platform: Platform.OS,
    page,
    message,
    json,
    timestamp: new Date().toISOString(),
  };

  try {
    // fire-and-forget, but return the promise so callers can await if they want
    return customerService.sendMobileLogs(payload, userType);
  } catch (err) {
    // Avoid throwing from logger. Best-effort log only.
    // eslint-disable-next-line no-console
    console.warn('mobileLogger: failed to send log', err);
  }
}

export async function logError(params: {
  qrCode: string;
  page?: string;
  message?: string;
  error?: unknown;
  extra?: Record<string, any>;
}) {
  const { qrCode, page = 'unknown', message = 'error', error, extra } = params;
  const json = { error: serializeError(error), extra };
  return sendLog({ qrCode, level: 'ERROR', page, message, json });
}

export async function logAuthenticatedError(params: {
  userType: userType;
  page?: string;
  message?: string;
  error?: unknown;
  extra?: Record<string, any>;
}) {
  const { userType, page = 'unknown', message = 'error', error, extra } = params;
  const json = { error: serializeError(error), extra };
  return sendAuthenticatedLog({ userType, level: 'ERROR', page, message, json });
}

export async function log(params: {
  qrCode: string;
  level: LogLevel;
  page?: string;
  message?: string;
  json?: any;
}) {
  const { qrCode, level, page = 'unknown', message = '', json } = params;
  return sendLog({ qrCode, level, page, message, json });
}

export async function logAuthenticated(params: {
  userType: userType;
  level: LogLevel;
  page?: string;
  message?: string;
  json?: any;
}) {
  const { userType, level, page = 'unknown', message = '', json } = params;
  return sendAuthenticatedLog({ userType, level, page, message, json });
}

export default { logError, log, logAuthenticatedError, logAuthenticated };
