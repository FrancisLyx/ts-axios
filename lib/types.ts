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
  validateStatus?: (status: number) => boolean
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

export interface Axios {
  defaults: AxiosRequestConfig
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): Promise<any>
  (url: string, config?: AxiosRequestConfig): Promise<any>
}
