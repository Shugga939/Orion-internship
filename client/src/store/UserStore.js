import {makeAutoObservable} from 'mobx'

export default class UserStore {
  constructor () {
    this._isAuth = false
    this._user = {} 
    makeAutoObservable(this)
  }

  setIsAuth (bool) {
    this._isAuth = bool
  }

  get isAuth () {
    return this._isAuth
  }

  setUser (user) {
    this._user = user
  }

  get currentUser () {   // {...user.currentUSer}
    return this._user
  }

} 
