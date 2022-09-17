import './app.scss'
import { BrowserRouter } from 'react-router-dom';
import { useContext } from 'react/cjs/react.development';
import { Context } from '.';
import {observer} from 'mobx-react-lite'
import AppRoutes from './components/Router/AppRouter';
import IsPandingPage from './pages/IsPandingPage';


const App = observer(()=> {
  const {user} = useContext(Context)
  
  if (user.isPending) {
    return (
      <IsPandingPage/>
    )
  } else {
    return (
      <div className='messanger'>
        <BrowserRouter>
          <AppRoutes isAuth={user.isAuth}/>
        </BrowserRouter>
      </div>
    )
  }
})

export default App;
