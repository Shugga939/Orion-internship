import {makeAutoObservable} from 'mobx'

export default class RoomsStore {
  constructor () {
    this._roomsList = []
    makeAutoObservable(this)
  }

  initRoomsList(roomsList) {
    this._roomsList = roomsList
  }

  addRoom (roomsList) {
    this._roomsList.push(roomsList)
  }

  setLastMessage (id, message)  {
    this._roomsList.forEach((room) => {
      if (room.id === id) room.lastMessage = message
    })
  }

  get roomsList () {
    return this._roomsList
  }

  getCurrentRoom(id) {
    return this._roomsList.find((room)=> room.id === id) 
  }

} 
