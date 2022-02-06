import './InputThisAttaching.scss'


const InputThisAttaching = () => {

	return (
    <form className="formThisInput">
      <div className="inputAttachContainer">
        <label className="attachButton">
          <button></button>
        </label>
        <input 
          type="text" 
          className='inputThisAttaching' 
          name="inputThisAttaching"
          placeholder='Type a new message...'
        />
        <label className="sendButton"> Send
          <button></button>
        </label>
      </div>
    </form>
	)
}

export default InputThisAttaching;