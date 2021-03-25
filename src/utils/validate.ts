export const isExternal = (path: string): boolean => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const validUsername = (str: string): boolean => {
  const validMap = ['admin', 'editor']
  return validMap.indexOf(str.trim()) >= 0
}
