import { useCallback, useMemo, useRef } from "react";
import { useMemoRooms } from "../../hooks/useMemoRooms";
import ContactLink from "../ContactLink/ContactLink";
import ProfileModal from './../ProfileModal/ProfileModal'
import './ContactList.scss'
import { useContext, useEffect, useState } from "react/cjs/react.development";
import CreateChatRoom from "../CreateChatRoom/CreateChatRoom";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import LoaderCircle from "../ui/Loader/LoaderCircle";

const ContactList = observer(({
	roomId, 
	lastSentMessage, 
	roomsList, 
	setRoomsList,
	callbackForSaveTimeAtQuit,
	
}) => {

	const {user} = useContext(Context)
	let datesOfLastReadMessages = {...user.currentUser}.lastReadMessage
	let [groupChat, setGroupChat] = useState(true)
	let [serachActive, setSerachActive] = useState(false)
	let [searchValue, setSearchValue] = useState('')
	let [showProfile, setShowProfile] = useState(false)
	const [loadingContacts, setLoadingContacts] = useState(false)
	const serachInputRef = useRef(null)
	let arrayOfRooms = useMemoRooms(roomsList,searchValue)
	console.log(roomsList);

  const getAllowedRoomsWhithLastMessage = useCallback (
		async ()=> {
			setLoadingContacts(true)
      let resp = await fetch(`http://localhost:5000/chat/`, {
        headers: {
          lastMessages: true
        }
      })
      if (resp.ok) {
        const respJson = await resp.json()
        setRoomsList(respJson)
      } else {
        console.log(resp.status)
      }
      setLoadingContacts(false)
		},[setRoomsList]
	) 
	
      


	useEffect (()=> {
		if (serachActive) serachInputRef.current.focus()
	},[serachActive])
	

	useEffect(()=> {
		try {
			getAllowedRoomsWhithLastMessage()
		} catch (e) {
			console.log(e);
		}
	},[getAllowedRoomsWhithLastMessage])

	const openProfile = () => {
		setShowProfile(true)
	}

	const closeSearch = (event)=> {
		setSerachActive(false)
	}
		
	const switchSingle = (event)=> {
		setGroupChat(false)
	}

	const switchGroup = (event)=> {
		setGroupChat(true)
	}

	const hideSearchInput = (event)=> {
		if (!event.target.classList.contains('searchChat') &&
				!event.target.classList.contains('searchInputContainer') && 
			  event.target != serachInputRef.current) {
			setSerachActive(false)
		}
	}
	
	function renderButtons (className) {
		if (serachActive) {
			return 'hide'
		}
		if (groupChat && className === 'groupChat') {
			return `groupChat active`
		} else if (groupChat && className === 'singleChat') {
			return `singleChat`
		}
	
		if (!groupChat && className === 'groupChat') {
			return `groupChat`
		} else if (!groupChat && className === 'singleChat') {
			return `singleChat active`
		}
	}
	return (
		<div className="leftToolBar" onClick={hideSearchInput}>
			<ProfileModal 
				show={showProfile} 
				setShow={setShowProfile}
				callbackForSaveTimeAtQuit = {callbackForSaveTimeAtQuit}
			/>
			{!loadingContacts? 
				<div className="profile">
					<div className="avatar">
						<img src={process.env.REACT_APP_API_URL + {...user.currentUser}.avatar} alt='Photo'></img>
					</div>
					<div className="name"> {{...user.currentUser}.name} </div>
					<button className="settings" onClick={openProfile}/>
				</div> 
			:
				<div className="profile">
					<LoaderCircle/>
				</div>
			}
			{!loadingContacts? 
				<div className="contactList">
					{arrayOfRooms.map(room=> 
						<ContactLink
							id={room.id} 
							key={room.id}
							avatar={room.image} 
							currentId={roomId} 
							name={room.name}
							lastMessage={room.messageText}
							dateOfLastMessage={room.date}
							sender={room.sender}
							lastSentMessage={lastSentMessage}
							currentUserId={{...user.currentUser}.userId}
							dateOfLastReadMessage ={datesOfLastReadMessages[room.id]}
						/>
					)} 
				</div>
			:
				<div className="contactList">
					<LoaderCircle/>
				</div>
			}
			<CreateChatRoom setRoomsList={setRoomsList}/>
			<div className="lowerToolBar">
				<div className="buttons-icons">
					<button className={renderButtons('groupChat')} onClick={switchGroup}/>
					<button className={renderButtons('singleChat')} onClick={switchSingle}/>
					<button className={!serachActive? 'searchChat' : 'hide'} onClick={()=>setSerachActive(true)}/>
					<div className={serachActive? 'searchInputContainer' : 'hide'}>
						<input 
							value={searchValue} 
							onChange={event => setSearchValue(event.target.value)}
							type="text" 
							className='searchInput' 
							ref={serachInputRef}/>
						<button className="closeButton" onClick={closeSearch}></button>
					</div>
				</div>
			</div>
		</div>
	)
})

export default ContactList;