import './RegistrationForm.scss'
import { useEffect, useState, useContext } from "react";
import FormInput from "../FormInput/FormInput";
import SubmitFormButton from '../ui/SubmitFormButton/SubmitFormButton';
import { Link, useNavigate } from 'react-router-dom';
import { userRegistration } from '../../http/userAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import validateEmail from '../../utils/helpers/validateEmail'
import { CHAT_MAIN_ROUTE } from "./../../utils/consts"


const RegistrationForm = observer(()=> {
  const {user} = useContext(Context)
  const navigate = useNavigate()
  const defaultValues = {email: '', name: '', pass: '', repPass: ''}
  const [regForm, setRegForm] = useState (defaultValues)
  const [wrongValue, setWrongValue] = useState ({email:false, name: false, pass: false, repPass: false})
  const [errorMasage, setErrorMessage] = useState ({
    email: 'The field must be not empty', 
    name: 'The field must be not empty',
    pass: 'The field must be not empty',
    repPass: 'Passwords mismatch',
    server: '',
    emailBusy: ''
  })
  const [isValidForm, setIsValidForm] = useState (true)
  let isInvalidEmail = wrongValue.email && errorMasage.email
  let isInvalidName = wrongValue.name && errorMasage.name
  let isInvalidPassword = wrongValue.pass && errorMasage.pass
  let isInvalidReapetPassword = wrongValue.repPass && errorMasage.repPass

  useEffect(()=> {
    if (errorMasage.email || errorMasage.name || errorMasage.pass || errorMasage.repPass) {
      setIsValidForm(false)
    } else {
      setIsValidForm(true)
    }
  },[errorMasage])


  const createUser = async (event)=> {
    event.preventDefault()
    if (!regForm.email) {
      blurInput('email')
    } else if (!regForm.name) {
      blurInput('name')
    } else if (!regForm.pass) {
      blurInput('password')
    } else if (!regForm.repPass) {
      blurInput('repPassowrd')
    }

    if (isValidForm) {
      try {
        const data = await userRegistration({
          email: regForm.email, 
          name: regForm.name, 
          password: regForm.pass,
          avatar: 'defaultAvatar_single.jpg'
        })
          user.userLogin(data.data)
          navigate(CHAT_MAIN_ROUTE)
      } catch (e) {
        e.response.data.message === 'Email busy'?
          setErrorMessage({...errorMasage, emailBusy:'Email address already busy'}) 
          :
          setErrorMessage({...errorMasage, server:'Server error, try later'}) 
      } 
    }
  }

  const editEmail = (val)=> {
    setRegForm({...regForm, email: val})
    if (validateEmail(val)) {
      setErrorMessage({...errorMasage, email:'Invalid Email'})
    } else {
      setErrorMessage({...errorMasage, email:''})
    }
  }

  const editName= (val)=> {
    setRegForm({...regForm, name: val})
    const validPassLength = (val.length>4 && val.length<15)

    if (validPassLength) {
      setErrorMessage({...errorMasage, name:''})
    } else {
      setErrorMessage({...errorMasage, name:'The name must be between 5 and 15 symbols'})
    }
  }

  const editPass = (val)=>  {
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

  const editRepPass = (val)=> {
    setRegForm({...regForm, repPass: val})
    if (regForm.pass === val) {
      setErrorMessage({...errorMasage, repPass:''})
      setIsValidForm(false)
    } else {
      setErrorMessage({...errorMasage, repPass:'Passwords mismatch'})
    }
  }

  const blurInput = (inputName)=> {
    switch (inputName) {
      case 'email' : {
        setErrorMessage({...errorMasage, emailBusy:''}) 
        setWrongValue({...wrongValue, email: true})
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

        <FormInput className = 'email-input' name = {'email'} blur = {blurInput} value={regForm.email} changeValue = {editEmail} title = 'E-mail'/>
        {isInvalidEmail && <div className = 'error-message'>{errorMasage.email}</div>}

        <FormInput className = 'name-input' name = {'name'} blur = {blurInput} value={regForm.name} changeValue = {editName} title = 'Name'/>
        {isInvalidName && <div className = 'error-message'>{errorMasage.name}</div>}

        <FormInput className = 'password-input' name = {'password'} type = {'password'} blur = {blurInput} changeValue = {editPass} value={regForm.pass} title = 'Password'/>
        {isInvalidPassword && <div className = 'error-message'> {errorMasage.pass}</div>}
        
        <FormInput className = 'repPassword-input' name = {'repPassowrd'} type = {'password'} blur = {blurInput} changeValue = {editRepPass} value={regForm.repPass} title = 'Repeat password'/>
        {isInvalidReapetPassword && <div className = 'error-message'> {errorMasage.repPass}</div>}

        <SubmitFormButton title={'Registration'} callback={createUser}/>
        {errorMasage.server && <div className = 'error-message'> {errorMasage.server}</div>}
        {errorMasage.emailBusy && <div className = 'error-message'> {errorMasage.emailBusy}</div>}

        <div className = 'note-login'>
          <span>
            {"Have an account? "}
            <Link to={'/user/login'} className = 'link_reg'>Sign In</Link>
          </span>
        </div>
      </form>
    </div>
  );
})

export default RegistrationForm;