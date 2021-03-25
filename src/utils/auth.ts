import Cookies from 'js-cookie'

const tokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(tokenKey)
}

export function setToken(token: string) {
  return Cookies.set(tokenKey, token)
}

export function removeToken() {
  return Cookies.remove(tokenKey)
}
