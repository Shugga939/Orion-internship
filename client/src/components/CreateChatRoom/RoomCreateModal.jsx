import { useRef,useEffect, useState } from 'react'

import ConfirmModal from "../ConfirmModal/MessageModal"
import DefaultAvatar from './../../img/DefaultAvatar_group.jpg'

const RoomCreateModal = ({show, setShow, saveRoom}) => {
  let nameRef = useRef('')
  let fileRef = useRef(null)
  let [avatar, setAvatar] = useState(DefaultAvatar)
  let [showModalMessage, setShowModalMessage] = useState(false)
  let [error, setError] = useState({avatar:'', name:''})
  let [uploadedAvatar, setUploadedAvatar] = useState(false)

  const startName = ''

  useEffect(()=>{
    nameRef.current.value = '' 
  },[])

  let closeModal = function(event) {
    if (event.target.classList.contains('createRoomModalBackground') || 
        event.target.classList.contains('closeModalButton')) {

      if (startName !== nameRef.current.value || uploadedAvatar) {
        setShowModalMessage(true)
      } else {
        setShow(false)
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

  const saveChanges = event => {
    event.preventDefault()
    if (nameRef.current.value.length <4 || nameRef.current.value.length >20) {
      setError({...error,name:'Short or Long name'})
    } else {
      setError({...error,name:''})
    }
    let image = (avatar == DefaultAvatar) ? false : fileRef.current.files[0]
    saveRoom({image, name: nameRef.current.value})
    closeModalMessage()
  }

  const closeModalMessage = ()=> {
    setAvatar(DefaultAvatar)
    nameRef.current.value = startName
    setShowModalMessage(false)
    setUploadedAvatar(false)
    setShow(false)
  }

  return (
    <div>
      <div className={show? 'createRoomModalBackground': 'createRoomModalBackground hide'} onClick={closeModal}>
      <ConfirmModal 
          show={showModalMessage}
          setShow={setShowModalMessage}
          message='Close without changes?'
          callback={closeModalMessage}
      />
        <div className='createRoomModal'>
          <button className="closeModalButton" onClick={closeModal}/>
          <form className='createRoomContainer'>
            <div className="avatarContainer">
              <img src={avatar} alt="" className="avatar"/>
            </div> 
              <label className='uploadPhoto'> Change Photo
                <input type='file' ref={fileRef} onChange={changeAvatar}></input>
              </label>
              {error.avatar && <div className="errorMessage"> {error.avatar} </div>}
              <label className="nameContainer"> Group name:
                <div className="inputContainer"> 
                  <input type="text" className="inputName" defaultValue={nameRef.current.value} ref={nameRef} />
                </div>
              </label>
              {error.name && <div className="errorMessage"> {error.name} </div>}
            <button type='submit' className="save" onClick={saveChanges} >Save changes</button>
          </form>
        </div>
      </div>
    </div> 
  ) 
}
    


export default RoomCreateModal