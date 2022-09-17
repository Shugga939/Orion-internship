import './RoomBar.scss'
import RoomModal from './../RoomModal/RoomModal'
import { useState } from 'react'
import { Context } from '../../..'
import { useContext } from 'react/cjs/react.development'


const RoomBar = ({currentRoomId, currentRoom}) => {
  const {members} = useContext(Context)
  let [showRoomModal, setShowRoomModal] = useState(false)
	const openRoomModal = () => {
    if (!showRoomModal) {
      setShowRoomModal(true)
    }
	}

  return (
    <div className="roomBar" onClick={openRoomModal}>
      <RoomModal
        currentRoomId = {currentRoomId}
        roomsImage = {currentRoom?.image}
        roomsName = {currentRoom?.name}
        show = {showRoomModal}
        setShowRoomModal = {setShowRoomModal}
      />
      <div className="name" >{currentRoom?.name}</div>
      <div className="members" > {{...members.membersCount}[currentRoomId]} members </div>
    </div>
  )

}

export default RoomBar;