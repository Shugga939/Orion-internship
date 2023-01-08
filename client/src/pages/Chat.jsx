import './Pages.scss'
import React, { useRef, useEffect } from "react";

import ChatBoard from "../components/Chat/ChatBoard/ChatBoard";
import ContactList from "../components/ContactList/ContactList";



const Chat = function () {
  console.log('render Chat');
  const socket = useRef()
  socket.current = new WebSocket(`ws://localhost:5000/chat/`)
  
  useEffect(() => {
    socket.current.onclose = () => console.log('Websocket is close')
    socket.current.onopen = () => console.log('Websocket is open')
  }, [])


  return (
    <div className='chatPage'>
      <ChatBoard
        socket={socket.current}
      />
      <ContactList
        socket={socket.current}
      />
    </div>
  );
}

export default Chat;