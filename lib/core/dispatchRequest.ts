import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '@/types'
import { createError, ErrorCodes } from '@/core/AxiosError'
import { buildUrl, combineURLs, isAbsoluteURL } from '@/helpers/utils'
import { flattenHeaders } from '@/helpers/headers'
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // config 参数预处理
  processConfig(config)
  return xhr(config)
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformUrl(config)
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params, baseURL, paramsSerializer } = config
  // baseUrl通用请求地址，如果提供了baseUrl,并且url是一个绝对路径，那么就需要拼接，如果url不是一个绝对路径，那么直接使用url进行请求。
  let fullUrl = baseURL && !isAbsoluteURL(url!) ? combineURLs(baseURL, url) : url
  return buildUrl(fullUrl!, params, paramsSerializer)
}

// 发送请求
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
