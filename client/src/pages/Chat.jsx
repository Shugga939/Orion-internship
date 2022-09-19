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
  const { user } = useContext(Context)
  const { members } = useContext(Context)
  const { id: roomId } = useParams()

  const socket = useRef()
  const previousId = useRef(null)
  const [messages, setMessages] = useState([]);        // Все сообщения в комнате
  const [roomsList, setRoomsList] = useState([]);      // {id, image, name} - rooms , {lastMesasge} - последнее сообщение в комнате
  const [lastMessage, setLastMessage] = useState({});  // Для обновления сообщений в ContactList
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [loadingMembers, setLoadingMembers] = useState(false)


  async function getMessagesOfRooom() {  
    setLoadingMessages(true)
    try {
      const {data} = await getMessages(roomId)
      setMessages(data)
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
  // async function getUsersOfRoom() {    /// todo hhtp
  //   let resp = await fetch(`http://localhost:5000/chat/${roomId}/getUsers`)
  //   if (resp.ok) {
  //     const users = await resp.json()
  //     members.setNewMembers(users)
  //     members.setMembersCount(roomId, users)
  //   } else {
  //     console.log(resp.status)
  //   }
  // }

  // async function getAllowedRoomsWhitLastMessage() {
  //   setLoadingContacts(true)
  //   let resp = await fetch(`http://localhost:5000/chat/`, {
  //     headers: {
  //       lastMessages: true
  //     }
  //   })
  //   if (resp.ok) {
  //     const respJson = await resp.json()
  //     setRoomsList(respJson)
  //   } else {
  //     console.log(resp.status)
  //   }
  //   setLoadingContacts(false)
  // }

  const saveTimeOfLastReadingMessage = useCallback(
    async () => {
      let time = Date.now()
      messages[0] ? time = messages[0].time : time = Date.now()
      if (previousId.current == null || previousId.current == undefined) {
        previousId.current = roomId
      } else {
        let resp = await fetch(`http://localhost:5000/user/change`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'update': 'readMessage' },
          body: JSON.stringify({ time, roomId: previousId.current })
        })
        if (resp.ok) {
          await resp.json()  //{message: 'success'}
        } else {
          console.log(resp.status)
        }
      }
    }, []
  )
  // async function saveTimeOfLastReadingMessage(messages) {
  //   let time = Date.now()
  //   messages[0] ? time = messages[0].time : time = Date.now()
  //   if (previousId.current == null || previousId.current == undefined) {
  //     previousId.current = roomId
  //   } else {
  //     console.log(previousId.current + 'boadrd');

  //     let resp = await fetch(`http://localhost:5000/user/change`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json', 'update': 'readMessage' },
  //       body: JSON.stringify({ time, roomId: previousId.current })
  //     })
  //     if (resp.ok) {
  //       await resp.json()  //{message: 'success'}
  //     } else {
  //       console.log(resp.status)
  //     }
  //   }
  // }

  const saveTimeOfLastReadingMessageAtQuit = useCallback(
    async ()=> {
      const time = Date.now()
      const resp = await fetch(`http://localhost:5000/user/change`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'update': 'readMessage' },
        body: JSON.stringify({ time, roomId: previousId.current })
      })
      if (resp.ok) {
        await resp.json()  //{message: 'success'}
      } else {
        console.log(resp.status)
      }
    },[]
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
          setMessages(prev => [message, ...prev])
        }
      }
      (async () => {
        await getMembersOfRoom()
        await getMessagesOfRooom()
      })()
      window.addEventListener('beforeunload', saveTimeOfLastReadingMessageAtQuit);
      return (()=> {
        window.removeEventListener('beforeunload', saveTimeOfLastReadingMessageAtQuit);
      })
    }
  }, [roomId, saveTimeOfLastReadingMessageAtQuit])

  return (
    <div className='chatPage'>
      {roomId ?
        <ChatBoard
          socket={socket.current}
          messages={messages}
          roomId={roomId}
          userId={{ ...user.currentUser }.id}
          callbackForSaveTime={saveTimeOfLastReadingMessage}
          previous={previousId.current}
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
        callbackForSaveTimeAtQuit={saveTimeOfLastReadingMessageAtQuit}
        loading={loadingContacts}
      />
    </div>
  );
})

export default Chat;