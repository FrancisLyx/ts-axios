import { AxiosRequestConfig } from '@/types'

export default {
  method: 'GET',
  timeout: 0,
  adapter: 'xhr',
  headers: {
    common: {
      'Content-Type': 'application/json, text/plain, */*'
    }
  },
  validateStatus(status) {
    return status >= 200 && status < 300
  }
} as AxiosRequestConfig
