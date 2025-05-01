import type { AxiosInstance, AxiosRequestConfig } from '@/types'
import Axios from '@/core/axios'

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config)
  return context as AxiosInstance
}

const axios = createInstance({
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus(status) {
    return status >= 200 && status < 300
  }
})

export default axios
