import { isUndefined, isArray, isObject, isPlainObject } from './is'

export function toJSONObject<T = object>(obj: T) {
  const stack = Array.from({ length: 10 })
  const visit = (source: T, i: number) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return
      }
      if (!('toJSON' in source)) {
        stack[i] = source
        const target: Record<string | number, any> = isArray(source) ? [] : {}
        for (const key in source) {
          const value = (source as Record<string, any>)[key]

          const reducedValue = visit(value, i + 1)
          !isUndefined(reducedValue) && (target[key] = reducedValue)
        }
        stack[i] = void 0
        return target
      }
    }
    return source
  }
  return visit(obj, 0)
}

export const kindOf = ((cache) => (thing: unknown) => {
  const str = toString.call(thing)
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase())
})(Object.create(null))

const { getPrototypeOf } = Object

export const getPropertyOf = (thing: unknown): any => {
  return getPrototypeOf(thing)
}

export const deepMerge = (...args: any[]): any => {
  const result = Object.create(null)
  const assignValue = (val: unknown, key: string) => {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = deepMerge(result[key], val)
    } else if (isPlainObject(val)) {
      result[key] = deepMerge({}, val)
    } else {
      result[key] = val
    }
  }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    for (const key in arg) {
      assignValue(arg[key], key)
    }
  }
  return result
}
