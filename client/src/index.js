import React from 'react';
import ReactDOM from 'react-dom';
import { createContext } from 'react';
import App from './App';
import UserStore from './store/UserStore';
import MembersStore from './store/MembersStore';
import MessagesStore from './store/MessagesStore';
import RoomsStore from './store/RoomsStore';

export const Context = createContext(null)

ReactDOM.render(
  <Context.Provider value={{
    user: new UserStore(),
    members: new MembersStore(),
    messages: new MessagesStore(),
    rooms: new RoomsStore()
  }}>
    <App />
  </Context.Provider>,
  document.getElementById('root')
);

