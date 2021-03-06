
interface PlainObject {
  [propName: string]: string;
}
export function param2Obj(url: string) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj: PlainObject = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

interface IObject {
  [prop: string]: unknown;
}
const isPlainObject = (x: unknown): x is IObject => {
  return typeof x === 'object' && x != null
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone<T extends unknown>(source: T): T {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments deepClone')
  }

  if (Array.isArray(source)) {
    return source.map(item => deepClone(item)) as T
  }

  const targetObj = {} as T
  for (const key in source) {
    if (isPlainObject(source[key])) {
      targetObj[key] = deepClone(source[key])
    } else {
      targetObj[key] = source[key]
    }
  }
  return targetObj
}
