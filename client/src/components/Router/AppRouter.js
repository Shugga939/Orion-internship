import { Route, Routes, Navigate } from 'react-router-dom';
import Chat from '../../pages/Chat';
import Registration from '../../pages/Registration';
import Login from '../../pages/Login';
import {LOGIN_ROUTE, REGISTRATION_ROUTE, CHAT_MAIN_ROUTE, ROOM_ROUTE, INVALID_ROOM} from "./../../utils/consts"
import { useContext } from 'react';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import InvalidPage from '../../pages/InvalidPage';

const AppRoutes = observer(()=> {
  const {user} = useContext(Context)

  return (
    <Routes>
      <Route path={LOGIN_ROUTE} element={<Login/>} exact/>
      <Route path={REGISTRATION_ROUTE} element={<Registration/>} exact/>
      <Route path={INVALID_ROOM} element={<InvalidPage/>} exact/>

      {user.isAuth && <Route path={ROOM_ROUTE} element={<Chat/>}/>}
      {user.isAuth && <Route path={CHAT_MAIN_ROUTE} element={<Chat/>} exact/>}

      <Route path='*' element={<Navigate replace to={LOGIN_ROUTE}/>}/>
  </Routes>  
  )
})

export default AppRoutes;


{/* <Routes>
<Route path={LOGIN_ROUTE} element={<Login/>}/>
<Route path={REGISTRATION_ROUTE} element={<Registration/>}/>

{user.getAuth() && <Route path={ROOM_ROUTE} element={<Chat user={user}/>}/>}
{user.getAuth() && <Route path={CHAT_MAIN_ROUTE} element={<Chat user={user}/>}/>}
{user.getAuth() ? <Route path='*' element={<Navigate replace to={CHAT_MAIN_ROUTE}/>}/> 
                : 
                  <Route path='*' element={<Navigate replace to={LOGIN_ROUTE}/>}/>}
</Routes>   */}