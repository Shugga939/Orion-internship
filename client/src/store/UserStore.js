import {makeAutoObservable, runInAction} from 'mobx'
import { checkAuth } from '../http/userAPI';
import jwt_docode from 'jwt-decode'


export default class UserStore {
  constructor () {
    this._isAuth = null
    this._isPending = null
    this._user = {} 
    this.initiaAuth()
    makeAutoObservable(this)
  }

  setIsAuth (bool) {
    this._isAuth = bool
  }

  get isAuth () {
    return this._isAuth
  }

  userLogin (data) {
    const { email, name, id } = jwt_docode(data.token)
    const {lastReadMessage, avatar} = data
    this._user = { email, name, id, lastReadMessage, avatar }
    this._isAuth = true
  }

  setUser (user) {
    this._user = user
  }

  get currentUser () {  
    return {...this._user}
  }

  get isPending () {
    return this._isPending
  }

  async initiaAuth() {
    this._isPending = true
    try {
      const data = await checkAuth()
      const {email, name, id} = jwt_docode(data.data.token)
      const lastReadMessage = data.data.lastReadMessage
      const avatar = data.data.avatar
      runInAction(() => {
        this._isAuth = true
        this._user = { email, name, id, lastReadMessage, avatar }
        this._isPending = false
      })
    } catch {
      runInAction(() => {
        this._isAuth = false
        this._isPending = false
      })
    }
  }

} 
