export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'

export type params = Record<string, any>
export type IHeaders = Record<string, any>

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: IHeaders | null
  baseURL?: string
  timeout?: number
  responseType?: XMLHttpRequestResponseType
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: params) => string
  adapter?: 'http' | 'xhr' | 'fetch' | ((config: AxiosRequestConfig) => AxiosPromise)
  cancelToken?: CancelToken
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: XMLHttpRequest
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export type AxiosErrorCode =
  | 'ERR_BAD_OPTION_VALUE'
  | 'ERR_BAD_OPTION'
  | 'ECONNABORTED'
  | 'ETIMEDOUT'
  | 'ERR_NETWORK'
  | 'ERR_FR_TOO_MANY_REDIRECTS'
  | 'ERR DEPRECATED'
  | 'ERR BAD RESPONSE'
  | 'ERR BAD REQUEST'
  | 'ERR CANCELED'
  | 'ERR NOT SUPPORT'
  | 'ERR INVALID URL'

export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: AxiosErrorCode | null
  request?: XMLHttpRequest
  response?: AxiosResponse
}
export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  getUri(config?: AxiosRequestConfig): string
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): AxiosPromise<T>

  postForm<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): AxiosPromise<T>
  putForm<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): AxiosPromise<T>
  patchForm<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
  Axios: AxiosClassStatic

  CancelToken: CancelTokenStatic
}

export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): AxiosInstance
}

export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  eject(id: number): void
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface Interceptor<T> {
  resolved: T
  rejected?: T
}

export interface CancelToken {
  promise: Promise<string>
  reason?: string

  throwIfRequested(): void
}

export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}
