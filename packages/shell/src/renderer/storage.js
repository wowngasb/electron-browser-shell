import Cookies from 'js-cookie'

export const try2obj = val => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch (error) {
      typeof console.warn === 'function' && console.warn('try2obj error:', error)
    }
  }
  return null;
}

export const try2str = val => typeof val !== 'string' ? JSON.stringify(val) : val

export const getCookie = name => Cookies.get(name)

export const setCookie = (name, content) => Cookies.set(name, content)

export const removeCookie = name => Cookies.remove(name)

export const getToken = () => Cookies.get('u_token')

export const setToken = token => Cookies.set('u_token', token)

export const removeToken = () => Cookies.remove('u_token')

export const setStore = (name, content) => name && window.localStorage.setItem(name, try2str(content))

export const getStore = name => name ? window.localStorage.getItem(name) : ''

export const getJson = name => name ? try2obj(getStore(name)) : null

export const removeStore = name => name && window.localStorage.removeItem(name)

export const getProfile = () => getJson('u_profile')

export const setProfile = data => setStore('u_profile', JSON.stringify(data))

export const removeProfile = () => removeStore('u_profile')