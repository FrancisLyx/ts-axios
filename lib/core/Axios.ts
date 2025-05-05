import {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  Axios as IAxios,
  RejectedFn,
  ResolvedFn
} from '@/types'
import dispatchRequest from './dispatchRequest'
import mergeConfig from './mergeConfig'
import { transformUrl } from './dispatchRequest'
import { Method } from '@/types'
import InterceptorManager from './interceptorManage'

interface interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChainNode<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

type PromiseChain<T> = PromiseChainNode<T>[]

export default class Axios implements IAxios {
  defaults: AxiosRequestConfig
  interceptors: interceptors
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
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

    const chain: PromiseChain<any> = [
      {
        resolved: dispatchRequest,
        rejected: void 0
      }
    ]

    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor)
    })

    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config) as AxiosPromise<AxiosRequestConfig>

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
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
