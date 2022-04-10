import './MessageModal.scss'

const ConfirmModal = ({show, setShow, message, callback}) => {

  let closeModal = function(event) {
    if (event.target.classList.contains('modalMessageBackground') || 
        event.target.classList.contains('closeMessageButton')) {
          setShow(false)
    }
  }

  return(
    <div className={show? 'modalMessageBackground': 'hide'} onClick={closeModal}>
    <div className='modalMessageContainer'>
      <button className="closeMessageButton" onClick={closeModal}/>
      <div className='message'>{message}</div>
      <div className='buttonsContainer'>
        <button onClick={()=>setShow(false)}>No</button>
        <button onClick={callback}>Yes</button>
      </div>
    </div>
  </div>
  )
}

export default ConfirmModal