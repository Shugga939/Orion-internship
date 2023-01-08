import { useContext, useRef, useEffect, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite';

import './ChatBoard.scss'

import InputThisAttaching from '../InputThisAttaching/InputThisAttaching';
import RoomBar from '../RoomBar/RoomBar';
import MessageArea from '../MessageArea/MessageArea';

import { Context } from '../../../index';
import LoaderRow from '../../ui/Loader/LoaderRow';
import { saveTime } from '../../../http/userAPI';
import { getMembers, getMessages } from '../../../http/chatAPI';
import { useParams } from 'react-router-dom';
import MainChatBoard from '../MainChatBoard/MainChatBoard';


const ChatBoard = observer(({  socket }) => {
  const {user, messages, members} = useContext(Context)

  const currentUser = user.currentUser
  const inputRef = useRef('')
  const previousId = useRef(null)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const { id: roomId } = useParams()
  console.log('render Board');


  const saveTimeOfLastReadingMessage = useCallback(
    async () => {
      const time = messages.lastMessage ? messages.lastMessage.time : Date.now()

      if (previousId.current == null || previousId.current === undefined) {
        previousId.current = roomId
      } else {
        try {
          saveTime(time, previousId.current)
        } catch (e) {
          console.log(e.message);
        } finally {
          previousId.current = roomId
        }
      }
    },[roomId]
  )

  const saveTimeOfLastReadingMessageAtQuit = useCallback(
    async ()=> {
      const time = messages.lastMessage ? messages.lastMessage.time : Date.now()
      try {
        saveTime(time, roomId)
      } catch (e) {
        console.log(e.message);
      }
    },[roomId]
  )

  useEffect(()=> {
    saveTimeOfLastReadingMessage()
    window.addEventListener('beforeunload', saveTimeOfLastReadingMessageAtQuit);

    return(()=> {
      window.removeEventListener('beforeunload', saveTimeOfLastReadingMessageAtQuit);
    })
  },[saveTimeOfLastReadingMessage, saveTimeOfLastReadingMessageAtQuit])
  

  const getMessagesOfRooom = useCallback(
    async ()=> {
      setLoadingMessages(true)
      try {
        const {data} = await getMessages(roomId)
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
        members.addNewMembers(data)
        members.setMembersCount(roomId, data)
      } catch (e) {
        console.log(e)
      }
    },[roomId, members]
  )

  useEffect(() => {
    if (roomId !== null && roomId !== 'main' && roomId !== undefined) {
      laodData()
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message.roomId === roomId) {
          messages.pushMessage(message)
        }
      }
    }

    async function laodData() {
      await getMembersOfRoom()
      await getMessagesOfRooom()
    }
  }, [roomId, messages, getMessagesOfRooom, getMembersOfRoom, socket])

  const sendMessage = async (event) => {
    event.preventDefault()
    const inputMessage = inputRef.current.value
    if (inputMessage==='') return
    const message = {
      username: currentUser.name,
      userId: currentUser.id,
      message: inputMessage,
      time: Date.now(),
      event: 'message',
      roomId
    }
    socket.send(JSON.stringify(message))
    inputRef.current.value = ''
  }

  if (!roomId) return <MainChatBoard/>

	return (
    <div className="chatBoard"> 
      <div className='roomBarContainer'>
        <RoomBar 
          currentRoomId={roomId}
        />
      </div>
      {!loadingMessages?
        <div className="messagesContainer">
          <MessageArea/>
        </div>
        :
        <div className="loaderContainer">
          <LoaderRow/>
        </div>
      }
      <div className="inputContainer">
        <InputThisAttaching 
          submitCallback={sendMessage}
          reference = {inputRef}
        />
      </div>
    </div>
	)
})

export default ChatBoard;