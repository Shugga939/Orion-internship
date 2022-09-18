import {$host} from './index.js'

export const getMessages = async (roomId)=> {
  const response = await $host.get(`chat/${roomId}`)
  return response
}

export const getMembers = async (roomId)=> {
  const response = await $host.get(`chat/${roomId}/getUsers`)
  return response
}
