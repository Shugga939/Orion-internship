import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";
import { useContext } from "react/cjs/react.development";
import { Context } from "..";
import LoginForm from "../components/LoginForm/LoginForm";
import './Pages.scss'

const Login = observer(()=> { 
  const {user} = useContext(Context)
  if (user.isAuth) {return <Navigate to='/chat/main'/>}

  return (
    <div className = 'loginPage'>
      <LoginForm/>
    </div>
  );
})

export default Login;