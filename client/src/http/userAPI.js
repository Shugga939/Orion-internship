import {$host} from './../http/index.js'

export const userRegistration = async (user)=> {
  const response = await $host.post('user/registration', user)
  return response
}

export const userLogin = async (user)=> {
  const response = await $host.post('user/login', user)
  return response
}

export const userLogout = async ()=> {
  const response = await $host.post('user/chat')
  return response
}

export const checkAuth = async ()=> {
  try {
    const response = await $host.get('user/auth')
    return response
  } catch (e) {
    console.log(e)
  }
}