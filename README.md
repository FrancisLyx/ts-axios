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

### 4. 配置合并与请求处理优化（新增）

- [x] headers 支持智能合并，自动规范化字段名，支持深层结构，去除无效值
- [x] url 支持 baseURL 拼接、绝对路径判断、斜杠处理
- [x] 支持 params 查询参数自动拼接到 url
- [x] 支持自定义 paramsSerializer

## 项目结构

```
lib/
├── axios.ts      # axios 实例工厂
├── types.ts      # 类型定义
├── index.ts      # 入口文件
└── core/         # 核心实现
    └── axios.ts  # Axios 类实现
```

## 功能实现

### 1. 类型定义

```typescript
// lib/types.ts
export interface AxiosRequestConfig {
  url?: string
  method?: string
  data?: any
  params?: any
  // ... 其他配置项 ...
}
```

### 2. 核心实现

```typescript
// lib/core/axios.ts
import { AxiosRequestConfig } from '@/types'

class Axios {
  constructor(config: AxiosRequestConfig) {
    // 初始化配置
  }
}

export default Axios
```

### 3. 实例工厂

```typescript
// lib/axios.ts
import type { AxiosInstance, AxiosRequestConfig } from '@/types'
import Axios from '@/core/axios'

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config)
  return context as AxiosInstance
}

const axios = createInstance({})
export default axios
```

### 4. 入口文件

```typescript
// lib/index.ts
import axios from './axios'
export default axios
```

---

### 5. 配置合并与请求处理优化（新增）

#### headers 合并优化

- headers 现在支持更智能的合并，默认配置和自定义配置会合并，后者优先。
- 支持大小写不敏感，自动规范化 header 字段名。
- 支持深层结构（如 headers.common、headers.get、headers.post 等）。
- 合并后会自动去除无效值（如 undefined/null）。

**示例：**

```typescript
axios({
  headers: {
    common: { 'X-Custom-Header': 'foo' },
    post: { 'Content-Type': 'application/json' }
  }
})
```

#### url 处理优化

- 支持 baseURL 和相对路径的自动拼接。
- 如果 url 是绝对路径，则不会拼接 baseURL。
- 自动处理斜杠，避免重复或缺失。
- 支持 params 查询参数自动拼接到 url 上。
- 支持自定义 paramsSerializer。

**示例：**

```typescript
axios({
  baseURL: 'https://api.example.com/',
  url: '/user',
  params: { id: 123 }
})
// 实际请求: https://api.example.com/user?id=123
```

#### 进阶用法

- 你可以通过 paramsSerializer 自定义查询参数的序列化方式：

```typescript
import qs from 'qs'

axios({
  url: '/user',
  params: { id: 123, tags: ['a', 'b'] },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
})
// 实际请求: /user?id=123&tags=a&tags=b
```

---

## 开发环境配置

### TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "es2015",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./lib/*"]
    }
  },
  "include": ["lib"]
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
