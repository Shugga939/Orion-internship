import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useContext } from 'react/cjs/react.development';
import { Context } from '.';
import {observer} from 'mobx-react-lite'
import './app.scss'
import AppRoutes from './components/Router/AppRouter';
import { checkAuth } from './http/userAPI';
import jwt_docode from 'jwt-decode'


const App = observer(()=> {
  const {user} = useContext(Context)
  
  useEffect(()=> {
    checkAuth().then(data=> {
      if (data?.data?.token) {
        user.setIsAuth(true)
        let {email, name, id} = jwt_docode(data.data.token)
        const lastReadMessage = data.data.lastReadMessage
        const avatar = data.data.avatar
        user.setUser({email, name, id, lastReadMessage, avatar})
      } else {
        user.setIsAuth(false)
      }
    })
  },[]) 

  return (
    <div className='messanger'>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  )
})

export default App;
