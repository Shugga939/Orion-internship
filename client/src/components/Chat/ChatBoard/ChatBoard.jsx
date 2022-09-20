import { useContext, useRef, useEffect, useCallback } from 'react'
import DateReference from '../../ui/DateReference/DateReference';
import InputThisAttaching from '../InputThisAttaching/InputThisAttaching';
import Message from '../Message/Message';
import './ChatBoard.scss'
import formatteDate from '../../../utils/helpers/formatteDates'
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';
import RoomBar from '../RoomBar/RoomBar';
import LoaderRow from '../../ui/Loader/LoaderRow';


const findRoomsIndex = (roomsList, roomId)=> {
  return roomsList.findIndex((room)=> room.id === roomId) 
}

const ChatBoard = observer(({
    roomId, 
    // messages,
    roomsList,
    socket,
    loading
  }) => {
  const {user, messages} = useContext(Context)
  const allMessages = messages.allMessages
  const currentUser = user.currentUser
  const inputRef = useRef('')
  const previousId = useRef(null)


  const saveTimeOfLastReadingMessage = useCallback(
    async () => {
      let time
      messages.lastMessage ? time = allMessages[0].time : time = Date.now()
      // messages[0] ? time = messages[0].time : time = Date.now()
      if (previousId.current == null || previousId.current === undefined) {
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
    },[allMessages]
  )

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


  useEffect(()=> {
    saveTimeOfLastReadingMessage()
    window.addEventListener('beforeunload', saveTimeOfLastReadingMessageAtQuit);

    return (()=> {
      window.removeEventListener('beforeunload', saveTimeOfLastReadingMessageAtQuit);
    })
  },[roomId, saveTimeOfLastReadingMessage, saveTimeOfLastReadingMessageAtQuit])
  

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

	return (
    <div className="chatBoard"> 
      <div className='roomBarContainer'>
        <RoomBar 
          currentRoom={roomsList[findRoomsIndex(roomsList, roomId)]}
          currentRoomId={roomId}
        />
      </div>
      {!loading? 
        <div className="messagesContainer">
          {allMessages.map((message,index)=>{  // todo use memo
            const messageDate = new Date(message.time)
            let nextMessageDate
            let nextMessageUserId
            if (index!== allMessages.length-1) {
              nextMessageDate = new Date(allMessages[index+1].time)
              nextMessageUserId = allMessages[index+1].userId
            } else {
              nextMessageDate = new Date(allMessages[index].time)
              nextMessageUserId = allMessages[index].userId
            }
            const formattedDate = formatteDate(messageDate)

            if (formattedDate===formatteDate(nextMessageDate) && index!==allMessages.length-1) {
              return <Message 
              message={message.message}   
              event={message.event}   
              key={message.time}
              date={messageDate}
              messageOwner={message.userId===currentUser.id}
              sameSender={message.userId===nextMessageUserId}
              userId={message.userId}
              />
            } else {
              return (
                <div className='withDate' key={message.time}>
                  <div className="dateContainer">
                    <DateReference date={formattedDate}/>
                  </div>
                  <Message 
                    message={message.message} 
                    event={message.event}   
                    date={messageDate}
                    messageOwner={message.userId===currentUser.id}
                    sameSender={false}
                    userId={message.userId}
                  />
                </div>
              )
            }
          }
          )}
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