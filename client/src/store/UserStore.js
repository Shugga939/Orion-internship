import {makeAutoObservable, runInAction} from 'mobx'
import { checkAuth } from '../http/userAPI';
import jwt_docode from 'jwt-decode'


export default class UserStore {
  constructor () {
    this._isAuth = null
    this._isPending = null
    this._user = {} 
    makeAutoObservable(this)
    this.initiaAuth()
  }

  setIsAuth (bool) {
    this._isAuth = bool
  }

  get isAuth () {
    return this._isAuth
  }

  userLogin (data) {
    this._isAuth = true
    const { email, name, id } = jwt_docode(data.token)
    const {lastReadMessage, avatar} = data
    this._user = { email, name, id, lastReadMessage, avatar }
  }

  setUser (user) {
    this._user = user
  }

  get currentUser () {   // {...user.currentUSer}
    return this._user
  }

  get isPending () {   // {...user.currentUSer}
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
    // checkAuth().then(data=> {
    //   if (data?.data?.token) {
    //     this.setIsAuth(true)
    //     const {email, name, id} = jwt_docode(data.data.token)
    //     const lastReadMessage = data.data.lastReadMessage
    //     const avatar = data.data.avatar
    //     this.setUser({email, name, id, lastReadMessage, avatar})
    //   } else {
    //     this.setIsAuth(false)
    //   }
    // })
  }

} 
