import DateReference from '../../ui/DateReference/DateReference';
import Switcher from '../../ui/Switcher/Switcher';
import InputThisAttaching from '../InputThisAttaching/InputThisAttaching';
import Message from '../Message/Message';
import './ChatBoard.scss'

const ChatBoard = () => {

	return (
    <div className="chatBoard"> 
      <div className='switcherContainer'>
        <Switcher></Switcher>
      </div>
      <div className="messagesContainer">
        <DateReference></DateReference>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
      </div>
    <div className="inputContainer">
      <InputThisAttaching></InputThisAttaching>
    </div>

    </div>
	)
}

export default ChatBoard;