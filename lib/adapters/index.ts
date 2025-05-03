import xhrAdapter from './xhr'
import httpAdapter from './http'
import fetchAdapter from './fetch'
import { AxiosPromise, AxiosRequestConfig } from '@/types'
import { isArray, isFunction, isString } from '@/helpers/is'

const knownAdapters: Record<string, ((config: AxiosRequestConfig) => AxiosPromise) | false> = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: fetchAdapter
}

type Adapter = AxiosRequestConfig['adapter']

export default {
  adapters: knownAdapters,
  getAdapter(adapters: Array<Adapter> | Adapter) {
    adapters = isArray(adapters) ? adapters : [adapters]

    const { length } = adapters

    let nameOfAdapter: Adapter
    let adapter: ((config: AxiosRequestConfig) => AxiosPromise) | boolean | undefined
    // iterate adapters，get the specific adapter
    for (let i = 0; i < length; i++) {
      nameOfAdapter = adapters[i]
      adapter = isString(nameOfAdapter) ? knownAdapters[nameOfAdapter.toLowerCase()] : nameOfAdapter
      if (adapter) break
    }
    if (!adapter) {
      if (adapter === false) {
        throw new Error(`Adapter ${nameOfAdapter} is not supported in this environment`)
      }
      throw new Error(
        `Unkonwn adapter ${nameOfAdapter} is specified` +
          `\nWe know these adapters inside the environment: ${Object.keys(knownAdapters).join(
            ', '
          )}`
      )
    }

    if (!isFunction(adapter)) {
      throw new Error(`Adapter is not a function`)
    }
    return adapter
  }
}
