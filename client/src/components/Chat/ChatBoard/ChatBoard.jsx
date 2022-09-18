import { useContext, useRef, useEffect } from 'react'
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
    callbackForSaveTime, 
    callbackForSaveTimeAtQuit,
    messages,
    roomsList,
    socket,
    loading
  }) => {
  const {user} = useContext(Context)
  const currentUser = user.currentUser
  const inputRef = useRef('')

  useEffect(()=> {

      (async()=> await callbackForSaveTime(messages))()


  },[roomId, ])


  useEffect(()=> {
    async function saveChanges () {
      await callbackForSaveTimeAtQuit()
    } 
    window.addEventListener('beforeunload', saveChanges);

    return (()=> {
      window.removeEventListener('beforeunload', saveChanges);
    })
  },[callbackForSaveTimeAtQuit])
  

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
          {messages.map((message,index)=>{  // todo use memo
            const messageDate = new Date(message.time)
            let nextMessageDate
            let nextMessageUserId
            if (index!== messages.length-1) {
              nextMessageDate = new Date(messages[index+1].time)
              nextMessageUserId = messages[index+1].userId
            } else {
              nextMessageDate = new Date(messages[index].time)
              nextMessageUserId = messages[index].userId
            }
            const formattedDate = formatteDate(messageDate)

            if (formattedDate===formatteDate(nextMessageDate) && index!==messages.length-1) {
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