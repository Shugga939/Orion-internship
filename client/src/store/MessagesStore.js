import {makeAutoObservable} from 'mobx'

// _members= {  
//   _id : {
//     name : String,
//     avatar : String
//   }
// }

export default class MessagesStore {
  constructor () {
    this._messages = []
    makeAutoObservable(this)
  }

  initMessages(messages) {
    this._messages = messages
  }

  pushMessage (message) {
    this._messages.unshift(message)
  }

  get lastMessage () {
    return this._messages[0]
  }

  get allMessages () {
    return [...this._messages]
  }
} 
