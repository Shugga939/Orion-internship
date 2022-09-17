import './ContactLink.scss'
import {Link, NavLink} from 'react-router-dom'
import { useEffect, useState } from 'react/cjs/react.development'
import formatteDate from '../../utils/helpers/formatteDates'


const ChatLink = ({
  id,
  currentId, 
  name,
  avatar,
  lastMessage, 
  dateOfLastMessage, 
  sender, 
  lastSentMessage,
  currentUserId,
  dateOfLastReadMessage
  }) => {
  let [unreadMessages, setUnreadMessages] = useState(0)
  let [textLastMessage, setTextLastMessage] = useState(lastMessage)
  let [senderLastMessage, setSenderLastMessage] = useState(sender)
  let [dateLastMessage, setDateLastMessage] = useState(dateOfLastMessage)

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
    console.log('new mess')
    if (lastSentMessage.roomId === id &&
        lastSentMessage.roomId !== currentId &&
        lastSentMessage.userId !== currentUserId
      ) {
        setUnreadMessages(++unreadMessages)
      }
      if (lastSentMessage.message && lastSentMessage.roomId === id) {
      setTextLastMessage(lastSentMessage.message)
      setSenderLastMessage(lastSentMessage.username)
      setDateLastMessage(formatteDate(new Date(lastSentMessage.time)))
    }
  },[lastSentMessage])

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
}

export default ChatLink;
