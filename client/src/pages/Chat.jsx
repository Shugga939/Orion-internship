import './Pages.scss'
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useContext, useRef } from "react";

import ChatBoard from "../components/Chat/ChatBoard/ChatBoard";
import MainChatBoard from "../components/Chat/MainChatBoard/MainChatBoard";
import ContactList from "../components/ContactList/ContactList";

import { observer } from "mobx-react-lite";
import { Context } from "..";
import { getMembers, getMessages } from '../http/chatAPI';


const Chat = observer(() => {
  const { user, members, messages } = useContext(Context)
  const { id: roomId } = useParams()

  const socket = useRef()
  const previousId = useRef(null)
  const [loadingMessages, setLoadingMessages] = useState(false)

  const getMessagesOfRooom = useCallback(
    async ()=> {
      setLoadingMessages(true)
      try {
        const {data} = await getMessages(roomId)
        // setMessages(data)
        messages.initMessages(data)
      } catch (e) {
        console.log(e)
      } finally {
        setLoadingMessages(false)
      }
    }, [roomId, messages] 
  )

  const getMembersOfRoom = useCallback (
    async ()=> {
      try {
        const {data} = await getMembers(roomId)   
        members.setNewMembers(data)
        members.setMembersCount(roomId, data)
      } catch (e) {
        console.log(e)
      }
    },[roomId, members]
  )

  useEffect(() => {
    socket.current = new WebSocket(`ws://localhost:5000/chat/`)
    socket.current.onclose = () => console.log('Websocket is close')
    socket.current.onopen = () => console.log('Websocket is open')
  }, [])


  useEffect(() => {
    previousId.current = roomId
    // messages.initMessages([])
    if (roomId != null && roomId !== 'main' && roomId !== undefined) {
      laodData()
      socket.current.onmessage = (event) => {
        const message = JSON.parse(event.data)
        // setLastMessage(message)
        if (message.roomId === roomId) {
          // setMessages(prev => [message, ...prev])
          messages.pushMessage(message)
        }
      }
    }

    async function laodData() {
      await getMembersOfRoom()
      await getMessagesOfRooom()
    }
  }, [roomId, getMessagesOfRooom, getMembersOfRoom, messages])

  return (
    <div className='chatPage'>
      {roomId ?
        <ChatBoard
          socket={socket.current}
          roomId={roomId}
          userId={{ ...user.currentUser }.id}
          loading={loadingMessages}
        />
        :
        <MainChatBoard />
      }
      <ContactList
        roomId={roomId}
        socket={socket.current}
      />
    </div>
  );
})

export default Chat;