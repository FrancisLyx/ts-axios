import { kindOf, getPropertyOf } from './index'
// 高阶函数，外层函数接收一个type参数，内层也就是return函数会接收一个thing参数,返回值是一个boolean类型，判断参数类型

const objToString = Object.prototype.toString

const typeofTest = (type: string) => (thing: unknown) => typeof thing === type

export const isFunction = typeofTest('function') as (thing: unknown) => thing is Function

export const isString = typeofTest('string') as (thing: unknown) => thing is string

export const isNumber = typeofTest('number') as (thing: unknown) => thing is number

export const isUndefined = typeofTest('undefined') as (thing: unknown) => thing is number

export const isObject = (thing: unknown): thing is Object => {
  return thing !== null && typeof thing === 'object' && !Array.isArray(thing)
}

export const isArray = <T = any>(thing: unknown): thing is T[] => Array.isArray(thing)

export const isNil = (thing: unknown): thing is null | undefined => thing == null

export function isDate(thing: unknown): thing is Date {
  return objToString.call(thing) === '[object Date]'
}

export function isPlainObject(thing: unknown): boolean {
  if (kindOf(thing) !== 'object') {
    return false
  }
  const prototype = getPropertyOf(thing)
  return (
    prototype === null ||
    prototype === Object.prototype ||
    (Object.getPrototypeOf(prototype) === null &&
      !(Symbol.toStringTag in (thing as Object)) &&
      !(Symbol.iterator in (thing as Object)))
  )
}

export function isURLSearchParams(thing: unknown): thing is URLSearchParams {
  return typeof thing !== 'undefined' && thing instanceof URLSearchParams
}
