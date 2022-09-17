import React from 'react';
import ReactDOM from 'react-dom';
import { createContext } from 'react';
import App from './App';
import UserStore from './store/UserStore';
import MembersStore from './store/MembersStore';

export const Context = createContext(null)

ReactDOM.render(
  <Context.Provider value={{
    user: new UserStore(),
    members: new MembersStore()
  }}>
    <App />
  </Context.Provider>,
  document.getElementById('root')
);

