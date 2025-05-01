import { AxiosRequestConfig, Axios as IAxios } from '@/types'

export default class Axios implements IAxios {
  defaults: AxiosRequestConfig
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
  }

  request(url: string, config: AxiosRequestConfig = {}): Promise<any> {
    if (typeof url === 'string') {
      config.url = url
    } else {
      config = url
    }
    return Promise.resolve(config)
  }
}
