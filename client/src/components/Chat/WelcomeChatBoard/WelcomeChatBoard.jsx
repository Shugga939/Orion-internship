import React from 'react'
import { useState, useRef, useEffect } from 'react';
import DateReference from '../../ui/DateReference/DateReference';
import Switcher from '../../ui/Switcher/Switcher';
import InputThisAttaching from '../InputThisAttaching/InputThisAttaching';
import Message from '../Message/Message';
import './WelcomeChatBoard.scss'


const WelcomeChatBoard = ({}) => {

  const socket = useRef()
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('')


	return (
    <div className="welcomeChatBoard"> 
      <div className="messagesContainer">
          Choose chatroom or create new 
      </div>
    </div>
	)
}

export default WelcomeChatBoard;