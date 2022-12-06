import {$host} from './index.js'

export const getMessages = async (roomId)=> {
  const response = await $host.get(`chat/${roomId}`)
  return response
}

export const getMembers = async (roomId)=> {
  const response = await $host.get(`chat/${roomId}/getUsers`)
  return response
}

export const saveTimeOfLastReadingMessage = async (time, roomId)=> {
  const resp = await fetch(`http://localhost:5000/user/change`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'update': 'readMessage' },
    body: JSON.stringify({ time, roomId })
  })
  if (resp.ok) {
    const mess = await resp.json()
    return mess  //{message: 'success'}
  } else {
    console.log(resp.status)
  }
}
