import './InputThisAttaching.scss'


const InputThisAttaching = ({value, setValue,submitCallback,reference}) => {

	return (
    <form className="formThisInput">
      <div className="inputAttachContainer">
        <label className="attachButton">
          <button type='button'></button>
        </label>
        <input
          // value = {value} 
          // onChange = {event=> setValue(event.target.value)}
          ref={reference}
          type="text"
          autoComplete='off' 
          className='inputThisAttaching' 
          name="inputThisAttaching"
          placeholder='Type a new message...'
        />
        <label className="sendButton"> Send
          <button type='submit' onClick={submitCallback}></button>
        </label>
      </div>
    </form>
	)
}

export default InputThisAttaching;