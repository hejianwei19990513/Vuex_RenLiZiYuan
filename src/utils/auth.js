import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const timeKey = 'hrsaas-timeKey'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTimeKey() {
  return Cookies.get(timeKey)
}

export function setTimeKey() {
  return Cookies.set(timeKey, Date.now())
}
