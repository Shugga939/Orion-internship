import './Message.scss'

const Message = () => {

	return (
    <div className="messageContainer">
      <div className='userName'>Tom</div>
      <div className='userMassage'>
        <div className="avatar">
        <img src="https://i.pinimg.com/736x/4e/ca/42/4eca42d6413b5f51d6d2b6698aa27ea3.jpg"></img>
        </div>
        <div className="message otherUser">
          <div className='text'> I have send the files back to ya it only took me about 
            60 mins this time was with testing too. </div>
            <div className='imgContainer'></div>
            <div className='time'> 15:05</div>
        </div>
      </div>
    </div>
	)
}

export default Message;