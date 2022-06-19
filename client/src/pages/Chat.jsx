import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useContext, useRef } from "react";
import ChatBoard from "../components/Chat/ChatBoard/ChatBoard";
import MainChatBoard from "../components/Chat/MainChatBoard/MainChatBoard";
import ContactList from "../components/ContactList/ContactList";
import './Pages.scss'
import { observer } from "mobx-react-lite";
import { Context } from "..";

const Chat = observer(()=> {
  const {user} = useContext(Context)
  const {members} = useContext(Context)

  let room = useParams()
  let [lastMessage, setLastMessage] = useState({});
  const socket = useRef()
  const [messages, setMessages] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const previousId = useRef('')
  const [loadingContacts, setLoadingContacts]= useState(false)
  const [loadingMessages, setLoadingMessages]= useState(false)


  async function getMessagesOfRooom () {    /// todo hhtp 
    setLoadingMessages(true)
    let resp = await fetch(`http://localhost:5000/chat/${room.id}`)
    if (resp.ok) {
      setMessages(await resp.json())
    } else {
      console.log(resp.status)
    }
    setLoadingMessages(false)
  }

  async function getUsersOfRoom () {    /// todo hhtp
    let resp = await fetch(`http://localhost:5000/chat/${room.id}/getUsers`)
    if (resp.ok) {
      const users = await resp.json()
      members.setNewMembers(users)
      members.setMembersCount(room.id, users)
    } else {
      console.log(resp.status)
    }

  }

  async function getAllowedRoomsWhitLastMessage() {
    setLoadingContacts(true)
    let resp = await fetch(`http://localhost:5000/chat/`, {
      headers : {
        lastMessages : true
      }
    })
    if (resp.ok) {
      setRoomsList(await resp.json())
    } else {
      console.log(resp.status)
    }
    setLoadingContacts(false)
  }
  
  async function saveTimeOfLastReadingMessage(messages) {
    let time = Date.now()
    messages[0]? time = messages[0].time : time = Date.now()
    if (previousId.current == '' || previousId.current == undefined) { 
      previousId.current = room.id
    } else {
    let resp = await fetch(`http://localhost:5000/user/change`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'update': 'readMessage'},
      body: JSON.stringify({time, roomId: previousId.current})
    })
    if (resp.ok) {
      await resp.json()  //{message: 'success'}
    } else {
      console.log(resp.status)
    }
  }}

  async function saveTimeOfLastReadingMessageAtQuit() {
    
    let time = Date.now()
    let resp = await fetch(`http://localhost:5000/user/change`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'update': 'readMessage'},
      body: JSON.stringify({time, roomId: previousId.current})
    })
    if (resp.ok) {
      await resp.json()  //{message: 'success'}
    } else {
      console.log(resp.status)
    }
  }

  useEffect(()=>{

    getAllowedRoomsWhitLastMessage()
    socket.current = new WebSocket(`ws://localhost:5000/chat/`)

    socket.current.onclose = () => {
      console.log('close')
    }

    socket.current.onopen = () => {
      console.log('open')
    }

  },[])

  
  useEffect(()=>{
    previousId.current = room.id
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setLastMessage(message)
      if (message.roomId === room.id) {
        console.log('Enter')
        setMessages(prev => [message, ...prev])
      }
    }
    if (room.id != '' && room.id != 'main' && room.id != undefined ) {
      (async()=> {
        await getUsersOfRoom()
        await getMessagesOfRooom()
      })()
    }
  },[room.id])

  return (
    <div className = 'chatPage'>
      {room.id? 
        <ChatBoard 
          socket={socket.current}
          messages={messages}
          roomId={room.id}
          userId={{...user.currentUser}.id}
          callbackForSaveTime ={saveTimeOfLastReadingMessage}
          callbackForSaveTimeAtQuit ={saveTimeOfLastReadingMessageAtQuit}
          previous={previousId.current}
          roomsList={roomsList}
          loading={loadingMessages}
        /> 
      : 
        <MainChatBoard />
      }
      <ContactList 
        roomId={room.id}
        lastSentMessage={lastMessage}
        roomsList={roomsList}
        setRoomsList={setRoomsList}
        callbackForSaveTimeAtQuit ={saveTimeOfLastReadingMessageAtQuit}
        loading={loadingContacts}
      />
    </div>
  );
})

export default Chat;