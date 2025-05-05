import type { AxiosStatic, AxiosRequestConfig, AxiosInstance } from '@/types'
import Axios from '@/core/Axios'
import _default from './default'
import { extend } from '@/helpers'
import mergeConfig from './core/mergeConfig'

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, Axios.prototype, context)
  extend(instance, context)

  return instance as AxiosInstance
}

const axios = createInstance(_default) as AxiosStatic

axios.create = function create(config: AxiosRequestConfig) {
  return createInstance(mergeConfig(_default, config))
}

axios.all = function all(promises: any[]) {
  return Promise.all(promises)
}

axios.spread = function spread(callback: (...args: any[]) => any) {
  return function wrap(arr: any[]) {
    return callback.apply(null, arr)
  }
}

export default axios
