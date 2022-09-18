import { useState } from 'react';
import FilePanel from '../FilePanel/FilePanel';
import './InputThisAttaching.scss'


const InputThisAttaching = ({submitCallback, reference}) => {
  const [show, setShow] = useState(false);

  const toggleFilePanel = ()=> {
    setShow(!show)
  }

	return (
    <form className="formThisInput">
      <FilePanel show={show} setShow={setShow}/>
      <div className="inputAttachContainer">
        <label className="attachButton">
          <button type='button' onClick={toggleFilePanel}> </button>
        </label>
        <input
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