import { useContext } from 'react'
import { observer } from 'mobx-react-lite';

import './MessageArea.scss'

import { Context } from '../../../index';

import formatteDate from '../../../utils/helpers/formatteDates'
import Message from '../Message/Message'; 
import DateReference from '../../ui/DateReference/DateReference';



const MessageArea = observer(() => {
  const { user, messages } = useContext(Context)
  const currentUser = user.currentUser
  const allMessages = messages.allMessages

  return (
    <>
      {allMessages.map((message,index)=>{  // todo use memo
      console.log('rend');
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
        }}
      )}
    </>
  )
})

export default MessageArea;
