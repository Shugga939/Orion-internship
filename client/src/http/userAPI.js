import {$host} from './index.js'

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

export const saveTime = async (time, roomId)=> { 
  const config = {
    headers : { 'Content-Type': 'application/json', 'update': 'readMessage' },
  }
  const data = JSON.stringify({ time, roomId })
  const response = await $host.put('user/change', data, config)
  return response
}