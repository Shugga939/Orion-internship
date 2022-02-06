import React from 'react';
import './app.scss'
import ChatBoard from './components/Chat/ChatBoard/ChatBoard';
import ContactList from './components/ContactList/ContactList';
import WebSock from "./WebSock";

function App() {

  return (
      <div className='Messanger'> 
        <ContactList></ContactList>
        <ChatBoard></ChatBoard>
      </div>
  )
}


export default App;
