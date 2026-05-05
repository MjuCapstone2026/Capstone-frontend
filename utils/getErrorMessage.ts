import axios from 'axios';
import { ERROR_MESSAGE } from '@/constants/errors';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status == null) return ERROR_MESSAGE.NETWORK_ERROR;
    if (status === 400) return ERROR_MESSAGE.BAD_REQUEST;
    if (status === 401) return ERROR_MESSAGE.UNAUTHORIZED;
    if (status === 403) return ERROR_MESSAGE.FORBIDDEN;
    if (status === 404) return ERROR_MESSAGE.NOT_FOUND;
    if (status >= 500) return ERROR_MESSAGE.SERVER_ERROR;
    return ERROR_MESSAGE.UNKNOWN;
  }
  return ERROR_MESSAGE.NETWORK_ERROR;
}
