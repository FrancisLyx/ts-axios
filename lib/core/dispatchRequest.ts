import { AxiosRequestConfig, AxiosPromise } from '@/types'
import { buildUrl, combineURLs, isAbsoluteURL } from '@/helpers/utils'
import { flattenHeaders } from '@/helpers/headers'
import adapters from '@/adapters'
import defaults from '@/default'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // config 参数预处理
  throwIfCancellationRequested(config)
  processConfig(config)
  const adapter = adapters.getAdapter(config?.adapter || defaults.adapter)
  return adapter(config)
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformUrl(config)
  config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformUrl(config: AxiosRequestConfig): string {
  const { url, params, baseURL, paramsSerializer } = config
  // baseUrl通用请求地址，如果提供了baseUrl,并且url是一个绝对路径，那么就需要拼接，如果url不是一个绝对路径，那么直接使用url进行请求。
  let fullUrl = baseURL && !isAbsoluteURL(url!) ? combineURLs(baseURL, url) : url
  return buildUrl(fullUrl!, params, paramsSerializer)
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
