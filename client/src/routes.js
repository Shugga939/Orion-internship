import Chat from "./pages/Chat"
import Login from "./pages/Login"
import Registration from "./pages/Registration"
import {CHAT_MAIN_ROUTE, CHAT_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, ROOM_ROUTE} from "./utils/consts"

export const authRoutes =[
  {
    path : CHAT_MAIN_ROUTE,
    Component : Chat
  },
  // {
  //   path : ROOM_ROUTE,
  //   Component : Chat
  // }
]

export const publicRoutes =[
  {
    path : LOGIN_ROUTE,
    Component : Login
  },
  {
    path : REGISTRATION_ROUTE,
    Component : Registration
  },
  
]