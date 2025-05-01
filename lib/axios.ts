import type { AxiosInstance, AxiosRequestConfig } from '@/types'
import Axios from '@/core/axios'

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config)
  return context as AxiosInstance
}

const axios = createInstance({})

export default axios
