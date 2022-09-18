import { useContext } from 'react'
import { Context } from '../../..'
import './Message.scss'


const Message = ({message,messageOwner,date,sameSender, userId, event}) => {
  const hours = date.getHours() < 10? `0${date.getHours()}` : date.getHours()
  const minutes = date.getMinutes() < 10?  `0${date.getMinutes()}` : date.getMinutes()
  const {members} = useContext(Context)
  const name = {...members.roomsMembers[userId]}.name
  const avatar = process.env.REACT_APP_API_URL + {...members.roomsMembers[userId]}.avatar

  if (!sameSender && event === 'message') {
    return (
      <div className="messageContainer">
        <div className={!messageOwner? 'userName' : 'userName ownerUserName'}>{name}</div>
        <div className={!messageOwner? 'userMassage' : 'userMassage ownerMessage'}>
          <div className="avatar">
          <img src={avatar} alt=''></img>
          </div>
          <div className={messageOwner? 'message user' : 'message otherUser'}>
            <div className='text'> {message} </div>
              <div className='imgContainer'></div>
              <div className='time'> {`${hours + ':' + minutes}`}</div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="messageContainer">
        <div className={!messageOwner? 'userMassage sameSender' : 'userMassage ownerMessage sameSenderOwner'}>
          <div className={messageOwner? 'message user' : 'message otherUser'}>
            <div className='text'> {message} </div>
              <div className='imgContainer'></div>
              <div className='time'> {`${hours + ':' + minutes}`}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Message;