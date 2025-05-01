import { isNil, isPlainObject } from '@/helpers/is'
import { deepMerge } from '@/helpers'
import { AxiosRequestConfig } from '@/types'
interface StrategyFunction {
  (v1: unknown, v2: unknown): any
}

const defaultStrategy: StrategyFunction = (v1, v2) => {
  return v2 ?? v1
}

const fromVal2Strategy: StrategyFunction = (v1, v2) => {
  if (typeof v2 != null) {
    return v2
  }
}

const deepMergeStrategy: StrategyFunction = (v1, v2) => {
  if (isPlainObject(v2)) {
    return deepMerge(v1, v2)
  }
  if (!isNil(v2)) {
    return v2
  }
  if (isPlainObject(v1)) {
    return deepMerge(v1)
  }
  if (!isNil(v1)) {
    return v1
  }
}

const strategyMap = new Map<string, StrategyFunction>([
  ['url', fromVal2Strategy],
  ['params', fromVal2Strategy],
  ['data', fromVal2Strategy],
  ['headers', fromVal2Strategy],
  ['auth', deepMergeStrategy]
])

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  const result = Object.create(null)
  const mergeField = (key: string): void => {
    const strategy = strategyMap.get(key) ?? defaultStrategy
    result[key] = strategy(config1[key], config2[key])
  }
  for (const key in config2) {
    mergeField(key)
  }
  for (const key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }
  return result
}
