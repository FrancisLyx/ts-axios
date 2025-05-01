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
  method?: Method
  url?: string
  data?: any
  params?: any
  headers?: IHeaders | null

  validateStatus?: (status: number) => boolean
}

export interface Axios {
  defaults: AxiosRequestConfig
  request: (url: string, config: AxiosRequestConfig) => Promise<any>
}

export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): Promise<any>
  (url: string, config?: AxiosRequestConfig): Promise<any>
}
