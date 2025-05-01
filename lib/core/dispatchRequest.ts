import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '@/types'

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
      reject(new Error('Network Error'))
    }
    request.send(data as any)
  })
}

function settle(resolve: any, reject: any, response: AxiosResponse): void {
  const validateStatus = response.config.validateStatus
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response)
  } else {
    reject(new Error(`Request failed with status code ${response.status}`))
  }
}
