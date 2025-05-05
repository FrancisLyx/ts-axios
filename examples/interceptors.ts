import axios from '../lib'

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    console.log('请求拦截器 1')
    // 例如：添加 token
    config.headers['Authorization'] = 'Bearer token123'
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.log('请求错误拦截器 1')
    return Promise.reject(error)
  }
)

// 可以添加多个请求拦截器
axios.interceptors.request.use(
  (config) => {
    console.log('请求拦截器 2')
    // 例如：添加时间戳
    config.params = {
      ...config.params,
      _t: Date.now()
    }
    return config
  },
  (error) => {
    console.log('请求错误拦截器 2')
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.log('响应拦截器 1')
    // 例如：统一处理响应格式
    if (response.data.code === 0) {
      return response.data.data
    }
    return Promise.reject(response.data)
  },
  (error) => {
    // 对响应错误做点什么
    console.log('响应错误拦截器 1')
    // 例如：统一处理错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页
          console.log('未授权')
          break
        case 403:
          // 权限不足
          console.log('权限不足')
          break
        case 404:
          // 请求的资源不存在
          console.log('请求的资源不存在')
          break
        case 500:
          // 服务器错误
          console.log('服务器错误')
          break
      }
    }
    return Promise.reject(error)
  }
)

// 可以添加多个响应拦截器
axios.interceptors.response.use(
  (response) => {
    console.log('响应拦截器 2')
    // 例如：处理 loading 状态
    return response
  },
  (error) => {
    console.log('响应错误拦截器 2')
    return Promise.reject(error)
  }
)

// 使用示例
axios({
  url: '/api/user',
  method: 'get',
  params: {
    id: 1
  }
})
  .then((response) => {
    console.log('请求成功：', response)
  })
  .catch((error) => {
    console.log('请求失败：', error)
  })

// 移除拦截器
const requestInterceptor = axios.interceptors.request.use((config) => {
  console.log('这个拦截器将被移除')
  return config
})

// 移除指定的请求拦截器
axios.interceptors.request.eject(requestInterceptor)

// 移除所有拦截器
axios.interceptors.request.clear()
axios.interceptors.response.clear()
