import { isFunction } from '@/helpers/is'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '@/types'
import { createError } from '@/core/AxiosError'
import { combineURLs, isAbsoluteURL } from '@/helpers/utils'
import { flattenHeaders } from '@/helpers/headers'

const isFetchAdapterSupported = typeof fetch !== 'undefined' && isFunction(fetch)

export default isFetchAdapterSupported &&
  function fetchAdapter(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
      const { url, method = 'get', data, headers = {}, responseType, timeout, baseURL } = config

      const fullUrl = baseURL && !isAbsoluteURL(url!) ? combineURLs(baseURL, url) : url
      const requestInit: RequestInit = {
        method: method.toUpperCase(),
        headers: flattenHeaders(headers, method) as HeadersInit,
        body: data,
        credentials: 'same-origin'
      }

      const controller = new AbortController()
      requestInit.signal = controller.signal

      if (timeout) {
        setTimeout(() => {
          controller.abort()
          reject(createError(`Timeout of ${timeout}ms exceeded`, config, 'ECONNABORTED'))
        }, timeout)
      }

      fetch(fullUrl!, requestInit)
        .then((fetchResponse) => {
          const responseData = responseType === 'text' ? fetchResponse.text() : fetchResponse.json()
          return responseData.then((data) => {
            const axiosResponse: AxiosResponse = {
              data,
              status: fetchResponse.status,
              statusText: fetchResponse.statusText,
              headers: Object.fromEntries(fetchResponse.headers.entries()),
              config,
              request: new XMLHttpRequest() // 为了兼容性，创建一个空的 XMLHttpRequest 实例
            }
            resolve(axiosResponse)
          })
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            reject(createError('Request aborted', config, 'ECONNABORTED'))
          } else {
            reject(createError(error.message, config, null, error))
          }
        })
    })
  }
