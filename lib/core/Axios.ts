import { AxiosPromise, AxiosRequestConfig, Axios as IAxios } from '@/types'
import dispatchRequest from './dispatchRequest'
import mergeConfig from './mergeConfig'
import { transformUrl } from './dispatchRequest'
import { Method } from '@/types'
export default class Axios implements IAxios {
  defaults: AxiosRequestConfig
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this._eachMethodNoData()
    this._eachMethodWithData()
  }

  request(url: string | AxiosRequestConfig, config: AxiosRequestConfig = {}): AxiosPromise {
    if (typeof url === 'string') {
      config.url = url
    } else {
      config = url
    }

    config = mergeConfig(this.defaults, config)
    return dispatchRequest(config)
  }

  getUri(config: AxiosRequestConfig): string {
    return transformUrl(mergeConfig(this.defaults, config))
  }

  private _eachMethodNoData() {
    ;(['get', 'delete', 'head', 'options'] as Method[]).forEach((method) => {
      ;(Axios.prototype as Record<string, any>)[method] = (
        url: string,
        config?: AxiosRequestConfig
      ) => this.request(mergeConfig(config || {}, { method, url }))
    })
  }

  private _eachMethodWithData() {
    ;(['post', 'put', 'patch'] as Method[]).forEach((method) => {
      const genHttpMethod =
        (isForm: boolean) => (url: string, data: unknown, config: AxiosRequestConfig) => {
          return this.request(
            mergeConfig(config || {}, {
              method,
              url,
              data,
              headers: isForm ? { 'Content-Type': 'multipart/form-data' } : {}
            })
          )
        }
      ;(Axios.prototype as Record<string, any>)[method] = genHttpMethod(false)
      ;(Axios.prototype as Record<string, any>)[`${method}Form`] = genHttpMethod(true)
    })
  }
}
