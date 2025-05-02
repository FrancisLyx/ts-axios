import type { IHeaders, Method } from '@/types'
import { deepMerge } from './index'

/**
 * 扁平化处理请求头
 *
 * @param headers 请求头对象,可以包含common(通用头)和特定method的头
 * @param method 请求方法
 * @returns 处理后的扁平化headers对象
 *
 * 该函数主要用于:
 * 1. 合并通用头(common)和特定method的headers
 * 2. 移除headers中的method相关属性(如get、post等)和common属性
 * 3. 最终得到一个扁平的headers对象
 *
 * 例如输入:
 * headers = {
 *   common: { Accept: 'application/json' },
 *   get: { 'X-Get-Header': 'value' },
 *   post: { 'X-Post-Header': 'value' }
 * }
 * method = 'get'
 *
 * 输出:
 * {
 *   Accept: 'application/json',
 *   'X-Get-Header': 'value'
 * }
 */

export function flattenHeaders(
  headers: IHeaders | undefined | null,
  method: Method
): IHeaders | undefined | null {
  if (!headers) return headers
  headers = deepMerge(headers.common, headers[method], headers)
  const methodToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodToDelete.forEach((method) => {
    delete headers![method]
  })
  return headers
}
