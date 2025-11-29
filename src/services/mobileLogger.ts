import axios from 'axios';
import { Platform } from 'react-native';

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
  backendBaseUrl: string;
  qrCode: string;
  level: LogLevel;
  page: string;
  message: string;
  json?: any;
}) {
  const { backendBaseUrl, qrCode, level, page, message, json } = opts;

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
    return axios.post(`${backendBaseUrl}/api/public/customers/qrCode/${qrCode}/mobileLogs`, payload);
  } catch (err) {
    // Avoid throwing from logger. Best-effort log only.
    // eslint-disable-next-line no-console
    console.warn('mobileLogger: failed to send log', err);
  }
}

export async function logError(params: {
  backendBaseUrl: string;
  qrCode: string;
  page?: string;
  message?: string;
  error?: unknown;
  extra?: Record<string, any>;
}) {
  const { backendBaseUrl, qrCode, page = 'unknown', message = 'error', error, extra } = params;
  const json = { error: serializeError(error), extra };
  return sendLog({ backendBaseUrl, qrCode, level: 'ERROR', page, message, json });
}

export async function log(params: {
  backendBaseUrl: string;
  qrCode: string;
  level: LogLevel;
  page?: string;
  message?: string;
  json?: any;
}) {
  const { backendBaseUrl, qrCode, level, page = 'unknown', message = '', json } = params;
  return sendLog({ backendBaseUrl, qrCode, level, page, message, json });
}

export default { logError, log };
