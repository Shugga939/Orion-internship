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
  // const [messages, setMessages] = useState([]);        // Все сообщения в комнате
  const [roomsList, setRoomsList] = useState([]);      // {id, image, name} - rooms , {lastMesasge} - последнее сообщение в комнате
  const [lastMessage, setLastMessage] = useState({});  // Для обновления сообщений в ContactList
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [loadingMembers, setLoadingMembers] = useState(false)


  async function getMessagesOfRooom() {  
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
  }

  const getMembersOfRoom = useCallback (
    async ()=> {
      setLoadingMembers(true)
      try {
        const {data} = await getMembers(roomId)   
        members.setNewMembers(data)
        members.setMembersCount(roomId, data)
      } catch (e) {
        console.log(e)
      } finally {
        setLoadingMembers(true)
      }
    },[roomId, members]
  )

  

  useEffect(() => {

    socket.current = new WebSocket(`ws://localhost:5000/chat/`)

    socket.current.onclose = () => {
      console.log('Websocket is close')
    }

    socket.current.onopen = () => {
      console.log('Websocket is open')
    }

  }, [])


  useEffect(() => {
    previousId.current = roomId
    if (roomId != null && roomId !== 'main' && roomId !== undefined) {

      socket.current.onmessage = (event) => {
        const message = JSON.parse(event.data)
        setLastMessage(message)
        if (message.roomId === roomId) {
          console.log('Enter')
          // setMessages(prev => [message, ...prev])
          messages.pushMessage(message)
        }
      }
      (async () => {
        await getMembersOfRoom()
        await getMessagesOfRooom()
      })()

    }
  }, [roomId, ])

  return (
    <div className='chatPage'>
      {roomId ?
        <ChatBoard
          socket={socket.current}
          // messages={messages}
          roomId={roomId}
          userId={{ ...user.currentUser }.id}
          // callbackForSaveTime={saveTimeOfLastReadingMessage}
          roomsList={roomsList}
          loading={loadingMessages}
        />
        :
        <MainChatBoard />
      }
      <ContactList
        roomId={roomId}
        lastSentMessage={lastMessage}
        roomsList={roomsList}
        setRoomsList={setRoomsList}
        loading={loadingContacts}
      />
    </div>
  );
})

export default Chat;