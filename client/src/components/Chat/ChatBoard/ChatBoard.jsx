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
import { saveTime } from '../../../http/userAPI';
import MessageArea from '../MessageArea/MessageArea';


const ChatBoard = observer(({ roomId, socket, loading}) => {
  const {user, messages} = useContext(Context)

  const currentUser = user.currentUser
  const inputRef = useRef('')
  const previousId = useRef(null)

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
          currentRoomId={roomId}
        />
      </div>
      {!loading?
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