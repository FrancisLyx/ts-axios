import { AxiosPromise, AxiosRequestConfig, Axios as IAxios } from '@/types'
import dispatchRequest from './dispatchRequest'
import mergeConfig from './mergeConfig'

export default class Axios implements IAxios {
  defaults: AxiosRequestConfig
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
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
}
