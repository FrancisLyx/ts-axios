import { kindOf } from '@/helpers'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '@/types'
import { createError } from '@/core/AxiosError'
import { flattenHeaders } from '@/helpers/headers'
import { URL } from 'url'
import * as http from 'http'
import * as https from 'https'

const isHttpAdaptorSupported =
  typeof process !== 'undefined' && kindOf(process.env.NODE_ENV) === 'process'

export default isHttpAdaptorSupported &&
  function httpAdapter(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
      const { url, method = 'get', data, headers = {}, timeout, baseURL } = config

      const parsedUrl = new URL(url!, baseURL)
      const isHttps = parsedUrl.protocol === 'https:'
      const transport = isHttps ? https : http

      const options: http.RequestOptions = {
        method: method.toUpperCase(),
        headers: flattenHeaders(headers, method) as http.OutgoingHttpHeaders,
        timeout
      }

      const req = transport.request(parsedUrl, options, (res) => {
        const chunks: Buffer[] = []

        res.on('data', (chunk) => {
          chunks.push(chunk)
        })

        res.on('end', () => {
          const responseData = Buffer.concat(chunks)
          const response: AxiosResponse = {
            data: responseData,
            status: res.statusCode!,
            statusText: res.statusMessage!,
            headers: res.headers,
            config,
            request: new XMLHttpRequest() // 为了兼容性，创建一个空的 XMLHttpRequest 实例
          }
          resolve(response)
        })
      })

      req.on('error', (err) => {
        reject(createError(err.message, config, null, new XMLHttpRequest()))
      })

      req.on('timeout', () => {
        req.destroy()
        reject(createError(`Timeout of ${timeout}ms exceeded`, config, 'ECONNABORTED'))
      })

      if (data) {
        req.write(data)
      }

      req.end()
    })
  }
