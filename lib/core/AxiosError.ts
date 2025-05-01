import type {
  AxiosError as IAxiosError,
  AxiosErrorCode,
  AxiosRequestConfig,
  AxiosResponse
} from '@/types'
import { isFunction } from '@/helpers/is'
import { toJSONObject } from '@/helpers'

export default class AxiosError extends Error implements IAxiosError {
  isAxiosError: boolean
  constructor(
    message: string,
    public config: AxiosRequestConfig,
    public code?: AxiosErrorCode | null,
    public request?: XMLHttpRequest,
    public response?: AxiosResponse
  ) {
    super(message)
    if (isFunction(Error.captureStackTrace)) {
      // 如果Error.captureStackTrace存在，则调用它来捕获堆栈跟踪
      Error.captureStackTrace(this, this.constructor)
    } else {
      // 浏览器环境，如果Error.captureStackTrace不存在，则使用new Error().stack来捕获堆栈跟踪
      this.stack = new Error(message).stack
    }

    this.isAxiosError = true
    Object.setPrototypeOf(this, AxiosError.prototype)
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      stack: this.stack,
      code: this.code,
      status: (this.response && this.response.status) ?? null,
      config: toJSONObject(this.config)
    }
  }
}

const descriptors: Record<string, { value: AxiosErrorCode }> = {}

;[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR DEPRECATED',
  'ERR BAD RESPONSE',
  'ERR BAD REQUEST',
  'ERR CANCELED',
  'ERR NOT SUPPORT',
  'ERR INVALID URL'
].forEach((code) => {
  descriptors[code as AxiosErrorCode] = {
    value: code as AxiosErrorCode
  }
})

Object.defineProperties(AxiosError, descriptors)

function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: AxiosErrorCode | null,
  request?: XMLHttpRequest,
  response?: AxiosResponse
) {
  const error = new AxiosError(message, config, code, request, response)
  return error
}

export { descriptors as ErrorCodes, createError }
