import {makeAutoObservable} from 'mobx'

// _members= {  
//   _id : {
//     name : String,
//     avatar : String
//   }
// }

export default class MembersStore {
  constructor () {
    this._members = {}
    this._membersCount = {}
    makeAutoObservable(this)
  }

  setMembersCount (roomId, membersArr) {
    if (!this._membersCount[roomId]) {
      this._membersCount[roomId] = membersArr.length
    }
  }

  addNewMembers (membersArr) {
    membersArr.forEach(mem => {
      if (!this._members[mem._id]) {
        this._members[mem._id] = {avatar: mem.avatar, name: mem.username}
      }
    });
  }

  get roomsMembers () {
    return this._members
  }

  get membersCount () {   
    return this._membersCount
  }

} 
