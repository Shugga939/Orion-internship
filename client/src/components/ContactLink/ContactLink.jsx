import './ContactLink.scss'

const ChatLink = () => {

  return (  
		<div className="linkContainer">
				<div className="avatar">
          <div className='status online'/>
          <img src="https://i.pinimg.com/736x/4e/ca/42/4eca42d6413b5f51d6d2b6698aa27ea3.jpg"></img>
        </div>
        <div className='rightContainer'>
          <div className="nameAndDate">
            <div className="name">Aleks</div>
            <div className="date"> 19/05/2020 </div>
          </div>
          <div className="message"> 
            <div className="lastMessage"> Popo </div>
            <div className="missedMessages">  10 </div>
          </div>
        </div>
		</div>
)
}

export default ChatLink;
