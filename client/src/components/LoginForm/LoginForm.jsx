import './LoginForm.scss'
import React, { useEffect, useState } from "react";
import FormInput from "../FormInput/FormInput";
import SubmitFormButton from '../ui/SubmitFormButton/SubmitFormButton';
import { Link, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react/cjs/react.development';
import { Context } from '../..';
import { userLogin } from '../../http/userAPI';
import jwt_docode from 'jwt-decode'


function validateEmail(value) {
  const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
  return !EMAIL_REGEXP.test(value);
}

const LoginForm = observer(() => {
  const {user} = useContext(Context)
  const defaultValues = {Email: '', pass: ''}
  let [regForm, setRegForm] = useState (defaultValues)
  let [wrongValue, setWrongValue] = useState ({Email:false, pass: false})
  let [errorAuth, setErrorAuth] = useState (false)
  let [errorMasage, setErrorMessage] = useState ({
    Email: 'The field must be not empty', 
    pass: 'The field must be not empty',
  })
  let [validForm, setValidForm] = useState (true)


  useEffect(()=> {
    if ( !errorMasage.Email && !errorMasage.pass) {
      setValidForm(true)
    } else {
      setValidForm(false)
    }
  },[errorMasage])

  useEffect(()=> {
  //   const userAuth  
  //   if (userAuth) { 
  //     Navigate('/home')
  //   } else {        // error logics
  //     setErrorAuth(true)
  //   } 
  })

  let login = (event)=> {
    event.preventDefault()
    if (!regForm.Email) {
      blurInput('email')
    } else if (!regForm.pass) {
      blurInput('password')
    } 
    if (regForm.Email && regForm.pass && validForm) {
      (async function auth () {
        try {
          let data = await userLogin({email: regForm.Email, password: regForm.pass})
          user.setIsAuth(true)
          const {email, name, id} = jwt_docode(data.data.token)
          const lastReadMessage = data.data.lastReadMessage
          const avatar = data.data.avatar
          user.setUser({email, name, id, lastReadMessage, avatar})
        } catch (e) {
          console.log(e.response.data.message)
          setErrorAuth(true)
        } 
      })()
    }
  }

  let editEmail = (val)=> {
    setRegForm({...regForm, Email: val})
    if (validateEmail(val)) {
      setErrorMessage({...errorMasage, Email:'Invalid Email'})
    } else {
      setErrorMessage({...errorMasage, Email:''})
    }
  }

  let editPass = (val)=>  {
    setRegForm({...regForm, pass: val})
    const validPassLength = (val.length>=6 && val.length<15) 

    if (!validPassLength ) {
      setErrorMessage({...errorMasage, pass:'The password must be between 6 and 15 symbols'})
    } else  {
      setErrorMessage({...errorMasage, pass:'', repPass:''})
    } 
  }

  let blurInput = (inputName)=> {
    switch (inputName) {
      case 'email' : {
        setWrongValue({...wrongValue, Email: true})
        break;
      }
      case 'password' : {
        setWrongValue({...wrongValue, pass: true})
        break;
      }
      default : break;
    }
  }

  return (
    <div className='loginContainer'>
      <form className = 'loginForm'>
        <h1>Sign In</h1>
        <FormInput className = 'email-input' name = {'email'} blur = {blurInput} value={regForm.Email} changeValue = {editEmail} title = 'E-mail'/>
        {(wrongValue.Email && errorMasage.Email) && <div className = 'error-message'>{errorMasage.Email}</div>}
        <FormInput className = 'password-input' name = {'password'} type = {'password'} blur = {blurInput} changeValue = {editPass} value={regForm.pass} title = 'Password'/>
        {(wrongValue.pass && errorMasage.pass) && <div className = 'error-message'> {errorMasage.pass}</div>}
        <SubmitFormButton title={'Login'} callback={login}/>
        {errorAuth && <div className = 'error-message'> {'Invalid Email or Password'}</div>}
        <div className = 'note-login'>
          {"Don't have an account? "} 
          <Link to={'/user/registration'} className = 'link_reg'> {'Registration'} </Link>
        </div>
      </form>
    </div>
  );
})

export default LoginForm;