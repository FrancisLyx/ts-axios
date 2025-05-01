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

### 3. 核心功能

- [x] 实现 Axios 类
- [x] 实现 createInstance 工厂函数
- [x] 实现 request 方法

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
}

export interface AxiosInstance {
  (config: AxiosRequestConfig): Promise<any>
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
