import './ContactLink.scss'
import {Link, NavLink} from 'react-router-dom'
import { useEffect, useState } from 'react/cjs/react.development'
import formatteDate from '../../utils/helpers/formatteDates'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import { useContext } from 'react'


const ChatLink = observer (({
  id,
  currentId, 
  name,
  avatar,
  lastMessage, 
  dateOfLastMessage, 
  sender, 
  // lastSentMessage,
  currentUserId,
  dateOfLastReadMessage
  }) => {
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [textLastMessage, setTextLastMessage] = useState(lastMessage)
  const [senderLastMessage, setSenderLastMessage] = useState(sender)
  const [dateLastMessage, setDateLastMessage] = useState(dateOfLastMessage)
  const { messages } = useContext(Context)
  const lastSendMessage = messages.lastMessage

  useEffect (()=> {
		async function getUnreadMessages () {    /// todo remove in helper
			let resp = await fetch(`http://localhost:5000/chat/getCount`, {
        headers : {roomId : id}
      }) 
			if (resp.ok) {
        const count = await resp.json()
        setUnreadMessages(count.countUnreadingMessages)
			} else {
				console.log(resp.status)
			}
		}
    getUnreadMessages ()
    
	},[])

  useEffect(()=>{
    if (id === currentId) {
      setUnreadMessages(0)}
    
  },[currentId])

  useEffect(()=> {
    if (lastSendMessage && lastSendMessage.roomId === id &&             // lastSendMessage.roomId ==> lastSendMessage
    lastSendMessage.roomId !== currentId &&
    lastSendMessage.userId !== currentUserId
    ) {
        console.log(lastSendMessage);
        setUnreadMessages((unreadMessages)=> unreadMessages + 1) 
      }
      if (lastSendMessage && lastSendMessage.message && lastSendMessage.roomId === id) {
      setTextLastMessage(lastSendMessage.message)
      setSenderLastMessage(lastSendMessage.username)
      setDateLastMessage(formatteDate(new Date(lastSendMessage.time)))
    }
  },[lastSendMessage])

  return ( 
    <NavLink to={`/chat/${id}`} className={`${id===currentId? 'linkContainer active' : 'linkContainer'}`}>
      <div className="avatar">
        <div className='status online'/>
        <img src={process.env.REACT_APP_API_URL+avatar} alt=''></img>
      </div>
      <div className='rightContainer'>
        <div className="nameAndDate">
          <div className="name">{name}</div>
          <div className="date"> {dateLastMessage} </div>
        </div>
        <div className="message"> 
          <div className="lastMessage">
            <span> {`${senderLastMessage}`} </span> 
            {textLastMessage? <span> {`:  ${textLastMessage}`} </span> : ''}
          </div>
          {unreadMessages>0 && <div className="missedMessages"> {unreadMessages} </div>}
        </div>
      </div>
    </NavLink>
  )
})

export default ChatLink;
