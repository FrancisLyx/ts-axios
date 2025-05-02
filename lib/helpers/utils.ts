import type { params } from '@/types'
import { isArray, isDate, isNil, isPlainObject, isURLSearchParams } from './is'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/g, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/g, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/g, '[')
    .replace(/%5D/g, ']')
}

/**
 * 判断是否为绝对URL
 * @param url 需要判断的URL字符串
 * @returns 如果是绝对URL返回true,否则返回false
 * @example
 * isAbsoluteURL('https://example.com') // true
 * isAbsoluteURL('//example.com') // true
 * isAbsoluteURL('/path/to/resource') // false
 */
export function isAbsoluteURL(url: string) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

/**
 * 合并URL
 * @param baseURL 基础URL
 * @param relativeURL 相对URL
 * @returns 合并后的完整URL
 */
export function combineURLs(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

/**
 * 构建URL
 * @param url 基础URL
 * @param params 参数对象
 * @param paramsSerializer 自定义序列化函数
 * @returns 拼接后的完整URL
 */
/**
 * @example
 * // 基本参数
 * buildUrl('/api', { id: 123, name: 'test' })
 * // 输出: '/api?id=123&name=test'
 *
 * // 数组参数
 * buildUrl('/api', { ids: [1, 2, 3] })
 * // 输出: '/api?ids[]=1&ids[]=2&ids[]=3'
 *
 * // 日期参数
 * buildUrl('/api', { date: new Date('2023-01-01') })
 * // 输出: '/api?date=2023-01-01T00:00:00.000Z'
 *
 * // 对象参数
 * buildUrl('/api', { obj: { a: 1, b: 2 } })
 * // 输出: '/api?obj={"a":1,"b":2}'
 *
 * // URLSearchParams
 * const params = new URLSearchParams()
 * params.append('foo', 'bar')
 * buildUrl('/api', params)
 * // 输出: '/api?foo=bar'
 *
 * // 自定义序列化
 * buildUrl('/api', { a: 1, b: 2 }, (params) => 'custom=true')
 * // 输出: '/api?custom=true'
 *
 * // 已有查询参数的URL
 * buildUrl('/api?sort=desc', { page: 1 })
 * // 输出: '/api?sort=desc&page=1'
 */

export function buildUrl(
  url: string,
  params?: params,
  paramsSerializer?: (params: params) => string
): string {
  if (!params) return url

  let serializedParams: string
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []
    Object.keys(params).forEach((key) => {
      const val = params[key]
      if (isNil(val)) return
      let values: string[]
      if (isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }
      values.forEach((_val) => {
        if (isDate(_val)) {
          _val = _val.toISOString()
        } else if (isPlainObject(_val)) {
          _val = JSON.stringify(_val)
        }
        parts.push(`${encode(key)}=${encode(_val)}`)
      })
    })
    serializedParams = parts.join('&')
  }
  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}
