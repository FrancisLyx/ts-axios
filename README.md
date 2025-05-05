# ts-axios

一个基于 TypeScript 实现的 axios 库，支持请求/响应拦截器、请求配置、响应数据转换等功能。

## 功能特性

- 支持浏览器和 Node.js 环境
- 支持 Promise API
- 支持请求和响应拦截器
- 支持请求配置
- 支持响应数据转换
- 支持错误处理
- 支持取消请求
- 支持 XSRF 防御
- 支持上传和下载进度监控
- 支持 HTTP 授权
- 支持自定义合法状态码
- 支持自定义参数序列化
- 支持 baseURL 配置
- 支持实例方法

## 安装

```bash
npm install ts-axios
```

## 使用方法

### 基本使用

```typescript
import axios from 'ts-axios'

// 发起 GET 请求
axios({
  url: '/api/user',
  method: 'get',
  params: {
    id: 1
  }
}).then((res) => {
  console.log(res)
})

// 发起 POST 请求
axios({
  url: '/api/user',
  method: 'post',
  data: {
    name: 'test'
  }
}).then((res) => {
  console.log(res)
})
```

### 请求方法别名

```typescript
// 发起 GET 请求
axios.get('/api/user', {
  params: {
    id: 1
  }
})

// 发起 POST 请求
axios.post('/api/user', {
  name: 'test'
})

// 发起 PUT 请求
axios.put('/api/user', {
  name: 'test'
})

// 发起 DELETE 请求
axios.delete('/api/user', {
  params: {
    id: 1
  }
})
```

### 创建实例

```typescript
const instance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 使用实例发起请求
instance.get('/user')
```

### 拦截器

```typescript
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如：添加 token
    config.headers['Authorization'] = 'Bearer token123'
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    // 例如：统一处理响应格式
    if (response.data.code === 0) {
      return response.data.data
    }
    return Promise.reject(response.data)
  },
  (error) => {
    // 对响应错误做点什么
    // 例如：统一处理错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页
          break
        case 403:
          // 权限不足
          break
        case 404:
          // 请求的资源不存在
          break
        case 500:
          // 服务器错误
          break
      }
    }
    return Promise.reject(error)
  }
)

// 移除拦截器
const requestInterceptor = axios.interceptors.request.use((config) => {
  return config
})
axios.interceptors.request.eject(requestInterceptor)

// 移除所有拦截器
axios.interceptors.request.clear()
axios.interceptors.response.clear()
```

### 并发请求

```typescript
axios.all([axios.get('/api/user'), axios.get('/api/order')]).then(
  axios.spread((userRes, orderRes) => {
    console.log(userRes, orderRes)
  })
)
```

## 请求配置

```typescript
{
  // 请求的服务器 URL
  url: '/user',

  // 请求方法
  method: 'get',

  // 请求基础 URL
  baseURL: 'https://api.example.com',

  // 请求头
  headers: {
    'Content-Type': 'application/json'
  },

  // URL 参数
  params: {
    id: 1
  },

  // 请求体数据
  data: {
    name: 'test'
  },

  // 请求超时时间
  timeout: 5000,

  // 响应数据类型
  responseType: 'json',

  // 上传进度回调
  onUploadProgress: progressEvent => {
    console.log(progressEvent)
  },

  // 下载进度回调
  onDownloadProgress: progressEvent => {
    console.log(progressEvent)
  },

  // 自定义合法状态码
  validateStatus: status => {
    return status >= 200 && status < 300
  }
}
```

## 响应数据结构

```typescript
{
  // 服务器返回的数据
  data: {},

  // HTTP 状态码
  status: 200,

  // HTTP 状态信息
  statusText: 'OK',

  // 响应头
  headers: {},

  // 请求配置
  config: {},

  // 请求实例
  request?: any
}
```

## 错误处理

```typescript
axios.get('/api/user').catch((error) => {
  if (error.response) {
    // 请求已发出，服务器返回状态码超出 2xx 范围
    console.log(error.response.data)
    console.log(error.response.status)
    console.log(error.response.headers)
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    console.log(error.request)
  } else {
    // 发送请求时发生错误
    console.log('Error', error.message)
  }
  console.log(error.config)
})
```

## 取消请求

```typescript
const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios
  .get('/api/user', {
    cancelToken: source.token
  })
  .catch((error) => {
    if (axios.isCancel(error)) {
      console.log('请求已取消', error.message)
    }
  })

// 取消请求
source.cancel('操作被用户取消')
```

## 项目结构

```
├── lib
│   ├── axios.ts              # 入口文件
│   ├── core
│   │   ├── Axios.ts          # Axios 类
│   │   ├── AxiosError.ts     # 错误类
│   │   ├── dispatchRequest.ts # 请求分发
│   │   ├── InterceptorManager.ts # 拦截器管理
│   │   └── transform.ts      # 数据转换
│   ├── defaults.ts           # 默认配置
│   ├── helpers
│   │   ├── bind.ts           # 绑定函数
│   │   ├── buildURL.ts       # 构建 URL
│   │   ├── cookie.ts         # Cookie 处理
│   │   ├── data.ts           # 数据处理
│   │   ├── error.ts          # 错误处理
│   │   ├── headers.ts        # 请求头处理
│   │   └── url.ts            # URL 处理
│   └── types.ts              # 类型定义
├── examples                   # 示例代码
├── test                      # 测试文件
├── package.json
└── tsconfig.json
```

## 类型定义

```typescript
// 请求配置接口
interface AxiosRequestConfig {
  url?: string
  method?: Method
  baseURL?: string
  headers?: any
  params?: any
  data?: any
  timeout?: number
  responseType?: XMLHttpRequestResponseType
  onUploadProgress?: (e: ProgressEvent) => void
  onDownloadProgress?: (e: ProgressEvent) => void
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  auth?: AxiosBasicCredentials
  cancelToken?: CancelToken
}

// 响应数据接口
interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request?: any
}

// 拦截器接口
interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  eject(id: number): void
  clear(): void
}

// 拦截器管理接口
interface Interceptors {
  request: AxiosInterceptorManager<AxiosRequestConfig>
  response: AxiosInterceptorManager<AxiosResponse>
}
```

## 开发

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 构建
npm run build
```

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT
