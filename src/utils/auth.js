import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const AccessTokenKey = 'Access-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getAccessToken() {
  const a = Cookies.get(AccessTokenKey)
  if (a === undefined || a === '') { return '' } else { return JSON.parse(a) }
}

export function setAccessToken(headers) {
  return Cookies.set(AccessTokenKey, headers)
}

export function removeAccessToken() {
  return Cookies.remove(AccessTokenKey)
}
