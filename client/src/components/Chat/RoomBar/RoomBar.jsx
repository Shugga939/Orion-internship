import './RoomBar.scss'
import RoomModal from './../RoomModal/RoomModal'
import { useState } from 'react'
import { Context } from '../../..'
import { useContext } from 'react/cjs/react.development'
import { observer } from 'mobx-react-lite'

const RoomBar = observer(({currentRoomId}) => {
  const {members, rooms} = useContext(Context)
  const [showRoomModal, setShowRoomModal] = useState(false)
  const currentRoom = rooms.getCurrentRoom(currentRoomId)
  
	const openRoomModal = () => {
    if (!showRoomModal) {
      setShowRoomModal(true)
    }
	}

  return (
    <div className="roomBar" onClick={openRoomModal}>
      {currentRoom? 
        <>
          <RoomModal
            currentRoomId = {currentRoomId}
            roomsImage = {currentRoom?.image}
            roomsName = {currentRoom?.name}
            show = {showRoomModal}
            setShowRoomModal = {setShowRoomModal}
          />
          <div className="name" >{currentRoom.name}</div>
          <div className="members" > {{...members.membersCount}[currentRoomId]} members </div>
        </>
      : 
       ''
      }
    </div>
  )

})

export default RoomBar;