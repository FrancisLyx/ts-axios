# ts-axios

一个基于 TypeScript 实现的 axios 库。

## 已实现功能

### 1. 基础配置

- [x] 初始化项目结构
- [x] 配置 TypeScript
- [x] 设置路径别名
- [x] 配置开发环境

### 2. 类型系统

- [x] 定义 AxiosRequestConfig 接口
- [x] 定义 AxiosInstance 接口
- [x] 定义 AxiosStatic 接口
- [x] 定义 AxiosResponse 接口
- [x] 定义 AxiosError 接口
- [x] 定义 AxiosPromise 接口
- [x] 定义 AxiosErrorCode 类型

### 3. 核心功能

- [x] 实现 Axios 类
- [x] 实现 createInstance 工厂函数
- [x] 实现 request 方法
- [x] 实现错误处理机制
- [x] 实现错误代码常量
- [x] 实现错误创建工厂函数
- [x] 实现静态方法（create、all、spread）

### 4. 配置合并与请求处理优化

- [x] headers 支持智能合并，自动规范化字段名，支持深层结构，去除无效值
- [x] url 支持 baseURL 拼接、绝对路径判断、斜杠处理
- [x] 支持 params 查询参数自动拼接到 url
- [x] 支持自定义 paramsSerializer

### 5. 适配器系统

- [x] 实现 fetch 适配器（浏览器环境）
  - 支持请求超时
  - 支持不同的响应类型（text/json）
  - 支持请求取消
  - 自动处理请求头和响应头
- [x] 实现 http 适配器（Node.js 环境）
  - 支持 HTTP/HTTPS 请求
  - 支持请求超时
  - 支持请求取消
  - 自动处理请求头和响应头
  - 支持流式响应数据处理

## 项目结构

```
lib/
├── axios.ts      # axios 实例工厂
├── types.ts      # 类型定义
├── index.ts      # 入口文件
├── core/         # 核心实现
│   ├── axios.ts  # Axios 类实现
│   └── mergeConfig.ts # 配置合并
└── adapters/     # 适配器实现
    ├── fetch.ts  # fetch 适配器
    └── http.ts   # http 适配器
```

## 功能实现

### 1. 类型定义

```typescript
// lib/types.ts
export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  // ... 其他配置项 ...
}

export interface AxiosInstance {
  (config: AxiosRequestConfig): Promise<any>
  (url: string, config?: AxiosRequestConfig): Promise<any>
  defaults: AxiosRequestConfig
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
}
```

### 2. 核心实现

```typescript
// lib/core/axios.ts
class Axios {
  defaults: AxiosRequestConfig
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this._eachMethodNoData()
    this._eachMethodWithData()
  }

  request(url: string | AxiosRequestConfig, config: AxiosRequestConfig = {}): AxiosPromise {
    // ... 实现细节
  }
}
```

### 3. 实例工厂

```typescript
// lib/axios.ts
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, Axios.prototype, context)
  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(_default)

// 添加静态方法
axios.create = function create(config: AxiosRequestConfig) {
  return createInstance(mergeConfig(_default, config))
}

axios.all = function all(promises: any[]) {
  return Promise.all(promises)
}

axios.spread = function spread(callback: (...args: any[]) => any) {
  return function wrap(arr: any[]) {
    return callback.apply(null, arr)
  }
}
```

### 4. 使用示例

```typescript
// 基本使用
axios({
  url: '/user',
  method: 'get'
})

// 快捷方法
axios.get('/user')
axios.post('/user', { name: 'test' })

// 创建实例
const instance = axios.create({
  baseURL: 'https://api.example.com'
})

// 并发请求
axios.all([axios.get('/user'), axios.get('/posts')]).then(
  axios.spread((user, posts) => {
    // 处理响应
  })
)
```

## 开发环境配置

### TypeScript 配置

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["lib/*"]
    }
  }
}
```

## 使用

```typescript
import axios from 'ts-axios'

axios({
  url: '/api/user',
  method: 'get',
  params: {
    id: 1
  }
})
```

## 开发命令

```shell
# 启动开发服务器
$ npm run dev

# 运行测试
$ npm run test

# 构建
$ npm run build
```

## 许可证

MIT
