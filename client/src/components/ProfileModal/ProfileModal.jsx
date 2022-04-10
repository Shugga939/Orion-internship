import { useRef } from 'react'
import './ProfileModal.scss'
import ConfirmModal from '../ConfirmModal/MessageModal'
import { useContext, useEffect, useState } from 'react/cjs/react.development'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import { userLogout } from '../../http/userAPI'


const ProfileModal = observer(({show, setShow, callbackForSaveTimeAtQuit}) => {
  let {user} = useContext(Context)

  let nameRef = useRef('')
  let fileRef = useRef(null)
  let [avatar, setAvatar] = useState(process.env.REACT_APP_API_URL + {...user.currentUser}.avatar)
  let [showModalMessage, setShowModalMessage] = useState(false)
  let [error, setError] = useState({avatar:'', name:''})
  let [uploadedAvatar, setUploadedAvatar] = useState(false)

  const startName = {...user.currentUser}.name 
  const startAvatar = process.env.REACT_APP_API_URL + {...user.currentUser}.avatar  

  useEffect(()=>{
    nameRef.current.value = {...user.currentUser}.name
  },[])


  async function saveInServer() {
    let formData = new FormData();
    if (avatar != startAvatar) {
      formData.append('avatar', fileRef.current.files[0])
    }
    formData.append('name',nameRef.current.value )
    let resp = await fetch(`http://localhost:5000/user/change`, {
      method: 'PUT',
      headers: { 'update': 'information'},
      body: formData
    })
    if (resp.ok) {
      await resp.json()  //{message: 'success'}
    } else {
      console.log(resp.status)
    }
  }



  let closeModal = function(event) {
    if (event.target.classList.contains('profileModalBackground') || 
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

  const saveChanges = async (event) => {
    event.preventDefault()
    if (nameRef.current.value.length <4 || nameRef.current.value.length >20) {
      setError({...error,name:'Short or Long name'})
    } else {
      setError({...error,name:''})
    }
    setShow(false)
    saveInServer()
  }

  const logout = async ()=> {
    await callbackForSaveTimeAtQuit()
    let data = await userLogout()
    user.setIsAuth(false)
    user.setUser({})
  }

  const closeModalMessage = ()=> {
    setAvatar(startAvatar)
    nameRef.current.value = startName
    setShowModalMessage(false)
    setUploadedAvatar(false)
    setShow(false)
  }

  return (
    <div>
      <div className={show? 'profileModalBackground': 'profileModalBackground hide'} onClick={closeModal}>
        <ConfirmModal 
          show={showModalMessage}
          setShow={setShowModalMessage}
          message='Close without changes?'
          callback={closeModalMessage}
        />
        <div className='profileModal'>
          <button className="closeModalButton" onClick={closeModal}/>
          <form className='profileContainer'>
            <div className="emailContainer">{{...user.currentUser}.email}</div>
            <button className='logout' type='button' onClick={logout}> Sign Out </button>
            <div className="avatarContainer">
              <img src={avatar} alt="" className="avatar"/>
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
        </div>
      </div>
    </div> 
  ) 
})

export default ProfileModal