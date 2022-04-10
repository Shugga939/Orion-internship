import './RoomModal.scss'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react/cjs/react.development'
import ConfirmModal from '../../ConfirmModal/MessageModal'


const RoomModal = observer(({
    show, 
    setShowRoomModal, 
    roomsImage, 
    roomsName,
    currentRoomId
  }) => {
  let nameRef = useRef('')
  let linkRef = useRef(null)
  let fileRef = useRef(null)
  let [avatar, setAvatar] = useState('')
  let [showModalMessage, setShowModalMessage] = useState(false)
  let [error, setError] = useState({avatar:'', name:''})
  let [uploadedAvatar, setUploadedAvatar] = useState(false)
  let [linkForInvite, setLinkForInvite] = useState('')
  let [copyStatus, setCoptyStatus] = useState('Click to copy')
  
  const startAvatar = process.env.REACT_APP_API_URL + roomsImage
  const startName = roomsName 

  useEffect(()=>{
    nameRef.current.value = roomsName 
    setAvatar(startAvatar)
    setError({avatar:'', name:''})
    setLinkForInvite(`${process.env.REACT_APP_API_URL}user/invite/${currentRoomId}`)
  },[currentRoomId])


  async function saveInServer() {
    let formData = new FormData();
    if (avatar != startAvatar) {
      formData.append('avatar', fileRef.current.files[0])
    }
    formData.append('name',nameRef.current.value )

    let resp = await fetch(`http://localhost:5000/chat/rooms`, {
      headers: {'roomId' : currentRoomId},
      method: 'PUT',
      body: formData
    })
    if (resp.ok) {
      await resp.json()  //{message: 'success'}
    } else {
      console.log(resp.status)
    }
  }

  let leaveRoom = async function(event) {
    event.preventDefault()

    let resp = await fetch(`http://localhost:5000/user/change`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'update': 'leaveRoom'},
      body: JSON.stringify({'roomId': currentRoomId})
    })
    if (resp.ok) {
      await resp.json()  //{message: 'success'}
    } else {
      console.log(resp.status)
    }
  }


  let closeModal = function(event) {
    if (event.target.classList.contains('roomModalBackground') || 
        event.target.classList.contains('closeModalButton')) {

      if (startName !== nameRef.current.value || uploadedAvatar) {
        setShowModalMessage(true)
      } else {
        setShowRoomModal(false)
      }
    }
  }

  const changeAvatar = event => {
    if (fileRef.current.files[0].type == 'image/png' || fileRef.current.files[0].type == 'image/jpeg') {
      setAvatar(URL.createObjectURL(fileRef.current.files[0]))
      setUploadedAvatar(true)
      setError({...error,avatar:''})
    } else {
      setError({...error,avatar:'Upload image'})
    }
  }

  const saveChanges = async (event) => {
    event.preventDefault()
    if (nameRef.current.value.length <4 || nameRef.current.value.length >20) {
      setError({...error,name:'Short or Long name'})
    } else {
      setError({...error,name:''})
      setShowRoomModal(false)
      saveInServer()
      closeModalMessage()
    }
  }


  const closeModalMessage = ()=> {
    setAvatar(startAvatar)
    nameRef.current.value = startName
    setShowModalMessage(false)
    setUploadedAvatar(false)
    setShowRoomModal(false)
  }

  const copyLink = ()=> {
    linkRef.current.select()
    document.execCommand("copy");
    setCoptyStatus('Copied')
  }

  return (
    <div>
      <div className={show? 'roomModalBackground': 'roomModalBackground hide'} onClick={closeModal}>
        <ConfirmModal 
          show={showModalMessage}
          setShow={setShowModalMessage}
          message='Close without changes?'
          callback={closeModalMessage}
        />
        <div className='roomModal'>
          <button className="closeModalButton" onClick={closeModal}/>
          <form className='roomContainer'>
            <div className="avatarContainer">
              <img src={avatar} alt="avatar" className="avatar"/>
            </div> 
              <label className='uploadPhoto'> Change Photo
                <input type='file' ref={fileRef} onChange={changeAvatar}></input>
              </label>
              {error.avatar && <div className="errorMessage"> {error.avatar} </div>}
              <label className="nameContainer"> Name:
                <div className="inputContainer"> 
                  <input type="text" className="inputName" defaultValue={nameRef.current.value} ref={nameRef} />
                </div>
              </label>
              {error.name && <div className="errorMessage"> {error.name} </div>}
            <button type='submit' className="save" onClick={saveChanges} >Save changes</button>
          </form>
          <div className="inviteContainer">
            <label className="linkContainer" > Link for invite:
              <div className="inputContainer"> 
                <textarea  ref={linkRef} className="link" defaultValue={linkForInvite} readOnly={true} />
              </div>
              <button 
                className={copyStatus != 'Copied'? 'copyButton' :'copyButton complete' } 
                onClick={copyLink}> 
                {copyStatus} 
              </button>
            </label>
          </div>
          <div className="media"> Media
            <button className="photos"> Open photos
            </button>
          </div>
          <button className="leaveRoom" onClick={leaveRoom}> Leave room</button>
        </div>
      </div>
    </div> 
  ) 
})

export default RoomModal