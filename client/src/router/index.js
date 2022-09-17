import Chat from "../pages/Chat"
import Login from "../pages/Login"
import Registration from "../pages/Registration"
import {CHAT_MAIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, ROOM_ROUTE} from "../utils/consts"

export const authRoutes = [
  {
    path : CHAT_MAIN_ROUTE,
    element : <Chat/>,
    exact: true
  },
  {
    path : ROOM_ROUTE,
    element : <Chat/>,
    exact: true
  }
]

export const publicRoutes = [
  {
    path : LOGIN_ROUTE,
    element : <Login/>,
    exact: true
  },
  {
    path : REGISTRATION_ROUTE,
    element : <Registration/>,
    exact: true
  },
  
]