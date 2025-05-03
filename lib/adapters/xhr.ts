import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '@/types'
import settle from '@/core/settle'
import { createError, ErrorCodes } from '@/core/AxiosError'

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined'

export default isXHRAdapterSupported &&
  function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
      const { data, url, method = 'get', headers = {}, responseType, timeout } = config
      const request = new XMLHttpRequest()
      request.open(method.toLocaleLowerCase(), url!, true)
      request.onreadystatechange = function () {
        if (request.readyState !== 4) return
        if (request.status === 0) return
        const response: AxiosResponse = {
          data: request.response,
          status: request.status,
          statusText: request.statusText,
          headers,
          config,
          request
        }
        settle(resolve, reject, response)
      }
      request.onerror = function () {
        reject(createError('Network Error', config, null, request))
      }

      request.ontimeout = function () {
        reject(
          createError(
            `Timeout of ${config.timeout} ms exceeded`,
            config,
            ErrorCodes.ERR_TIMEOUT.value,
            request
          )
        )
      }

      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }

      request.send(data as any)
    })
  }
