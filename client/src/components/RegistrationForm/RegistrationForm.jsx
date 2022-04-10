import './RegistrationForm.scss'
import React, { useEffect, useState } from "react";
import FormInput from "../FormInput/FormInput";
import SubmitFormButton from '../ui/SubmitFormButton/SubmitFormButton';
import { Link, useNavigate } from 'react-router-dom';
import { userRegistration } from '../../http/userAPI';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react/cjs/react.development';
import { Context } from '../..';
import jwt_docode from 'jwt-decode'

function validateEmail(value) {
  const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
  return !EMAIL_REGEXP.test(value);
}

const RegistrationForm = observer(()=> {
  let {user} = useContext(Context)
  const defaultValues = {Email: '', name: '', pass: '', repPass: ''}
  let [regForm, setRegForm] = useState (defaultValues)
  let [wrongValue, setWrongValue] = useState ({Email:false, name: false, pass: false, repPass: false})
  let [errorMasage, setErrorMessage] = useState ({
    Email: 'The field must be not empty', 
    name: 'The field must be not empty',
    pass: 'The field must be not empty',
    repPass: 'Passwords mismatch',
    server: '',
    emailBusy: ''
  })
  let [validForm, setValidForm] = useState (true)
  const navigate = useNavigate()

  useEffect(()=> {
    if (!errorMasage.Email && !errorMasage.name && !errorMasage.pass && !errorMasage.repPass) {
      setValidForm(true)
    } else {
      setValidForm(false)
    }
  },[errorMasage])


  let createUser = (event)=> {
    event.preventDefault()
    if (!regForm.Email) {
      blurInput('email')
    } else if (!regForm.name) {
      blurInput('name')
    } else if (!regForm.pass) {
      blurInput('password')
    } else if (!regForm.repPass) {
      blurInput('repPassowrd')
    }

    if (regForm.Email && regForm.name && regForm.pass && regForm.repPass && validForm) {
      (async function registration () {
        try {
          let data = await userRegistration({
            email: regForm.Email, 
            name: regForm.name, 
            password: regForm.pass,
            avatar: 'defaultAvatar_single.jpg'
          })
           user.setIsAuth(true)
           let {email, name, id} = jwt_docode(data.data.token)
           const lastReadMessage = data.data.lastReadMessage
           const avatar = data.data.avatar
           user.setUser({email, name, id, lastReadMessage, avatar})
           navigate('/chat/main')
        } catch (e) {
          e.response.data.message == 'Email busy'?
            setErrorMessage({...errorMasage, emailBusy:'Email address already busy'}) 
            :
            setErrorMessage({...errorMasage, server:'Server error, try later'}) 
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


  let editName= (val)=> {
    setRegForm({...regForm, name: val})
    const validPassLength = (val.length>4 && val.length<15)

    if (!validPassLength) {
      setErrorMessage({...errorMasage, name:'The name must be between 5 and 15 symbols'})
    } else {
      setErrorMessage({...errorMasage, name:''})
    }
  }


  let editPass = (val)=>  {
    setRegForm({...regForm, pass: val})
    const validPassLength = (val.length>=6 && val.length<15) 
    const validPassCompare  = (regForm.repPass && (regForm.repPass === val))

    if (!validPassLength && validPassCompare) {
      setErrorMessage({...errorMasage, pass:'The password must be between 6 and 15 symbols', repPass:''})
    } else if (!validPassLength && !validPassCompare) {
      setErrorMessage({...errorMasage, pass:'The password must be between 6 and 15 symbols', repPass:'Passwords mismatch'})
    } else if (validPassLength && !validPassCompare) {
      setErrorMessage({...errorMasage, pass:'', repPass:'Passwords mismatch'}) 
    } else if (validPassLength && validPassCompare) {
      setErrorMessage({...errorMasage, pass:'', repPass:''})
    } 
  }

  let editRepPass = (val)=> {
    setRegForm({...regForm, repPass: val})
    if (regForm.pass === val) {
      setErrorMessage({...errorMasage, repPass:''})
      setValidForm(false)
    } else {
      setErrorMessage({...errorMasage, repPass:'Passwords mismatch'})
    }
  }


  let blurInput = (inputName)=> {
    switch (inputName) {
      case 'email' : {
        setErrorMessage({...errorMasage, emailBusy:''}) 
        setWrongValue({...wrongValue, Email: true})
        break;
      }
      case 'name' : {
        setWrongValue({...wrongValue, name: true})
        break;
      }
      case 'password' : {
        setWrongValue({...wrongValue, pass: true})
        break;
      }
      case 'repPassowrd' : {
        setWrongValue({...wrongValue, repPass: true})
        break;
      }
      default : break;
    }
  }


  return (
    <div className='registrationContainer'>
      <form className = 'registrationForm'>
        <h1>Registration</h1>
        <FormInput className = 'email-input' name = {'email'} blur = {blurInput} value={regForm.Email} changeValue = {editEmail} title = 'E-mail'/>
        {(wrongValue.Email && errorMasage.Email) && <div className = 'error-message'>{errorMasage.Email}</div>}
        <FormInput className = 'name-input' name = {'name'} blur = {blurInput} value={regForm.name} changeValue = {editName} title = 'Name'/>
        {(wrongValue.name && errorMasage.name) && <div className = 'error-message'>{errorMasage.name}</div>}
        <FormInput className = 'password-input' name = {'password'} type = {'password'} blur = {blurInput} changeValue = {editPass} value={regForm.pass} title = 'Password'/>
        {(wrongValue.pass && errorMasage.pass) && <div className = 'error-message'> {errorMasage.pass}</div>}
        <FormInput className = 'repPassword-input' name = {'repPassowrd'} type = {'password'} blur = {blurInput} changeValue = {editRepPass} value={regForm.repPass} title = 'Repeat password'/>
        {(wrongValue.repPass && errorMasage.repPass) && <div className = 'error-message'> {errorMasage.repPass}</div>}
        <SubmitFormButton title={'Registration'} callback={createUser}/>
        {errorMasage.server && <div className = 'error-message'> {errorMasage.server}</div>}
        {errorMasage.emailBusy && <div className = 'error-message'> {errorMasage.emailBusy}</div>}
        <div className = 'note-login'>
          {'Have an account? '} 
          <Link to={'/user/login'} className = 'link_reg'> {'Sign In'} </Link>
        </div>
      </form>
    </div>
  );
})

export default RegistrationForm;