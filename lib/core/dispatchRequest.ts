import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '@/types'
import { createError, ErrorCodes } from '@/core/AxiosError'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  return xhr(config)
}

function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data, url, method = 'get', headers = {} } = config
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
    request.send(data as any)
  })
}

function settle(resolve: any, reject: any, response: AxiosResponse): void {
  const validateStatus = response.config.validateStatus
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response)
  } else {
    reject(
      createError(
        `Request failed with status code ${response.status}`,
        response.config,
        [ErrorCodes.ERR_BAD_REQUEST.value, ErrorCodes.ERR_BAD_RESPONSE.value][
          Math.floor(response.status / 100) - 4
        ],
        response.request,
        response
      )
    )
  }
}
