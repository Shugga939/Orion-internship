import { useState } from "react"
import RoomCreateModal from "./RoomCreateModal"
import './CreateChatRoom.scss'

const CreateChatRoom = ({setRoomsList}) => {
  let [showModal, setShowModal] = useState(false)

    async function saveRoom (room) {
      let formData = new FormData();
      if (room.image) {
        formData.append('image', room.image)
      }
      formData.append('name', room.name )
      let resp = await fetch(`http://localhost:5000/chat/rooms`, {
      method: 'POST',
      body: formData
    })
    if (resp.ok) {
      const allowedRoomsWithLastMessages = await resp.json()
      setRoomsList(allowedRoomsWithLastMessages)  // new render rooms' list
    } else {
      console.log(resp.status)
    }
  }

  return (
    <div className="createChatRoom">
      <RoomCreateModal show={showModal} setShow={setShowModal} saveRoom={saveRoom}/>
      <button className="createRoomButton" type='button' onClick={()=>setShowModal(true)}> Create chat room</button>
    </div>
  )

} 

export default CreateChatRoom