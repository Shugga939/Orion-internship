import './LoginForm.scss'
import { useEffect, useState } from "react";
import FormInput from "../FormInput/FormInput";
import SubmitFormButton from '../ui/SubmitFormButton/SubmitFormButton';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react/cjs/react.development';
import { Context } from '../..';
import { userLogin } from '../../http/userAPI';
import validateEmail from '../../utils/helpers/validateEmail'


const LoginForm = observer(() => {
  const { user } = useContext(Context)
  const defaultValues = { email: '', pass: '' }
  const [regForm, setRegForm] = useState(defaultValues)
  const [wrongValue, setWrongValue] = useState({ email: false, pass: false })
  const [errorAuth, setErrorAuth] = useState(false)
  const [errorMasage, setErrorMessage] = useState({
    email: 'The field must be not empty',
    pass: 'The field must be not empty',
  })
  const [isValidForm, setIsValidForm] = useState(true)
  let isInvalidEmail = wrongValue.email && errorMasage.email
  let isInvalidPassword = wrongValue.pass && errorMasage.pass

  useEffect(() => {
    (errorMasage.email || errorMasage.pass)? setIsValidForm(false) : setIsValidForm(true)
  }, [errorMasage])

  const login = async (event) => {
    event.preventDefault()
    if (!regForm.email) {
      blurInput('email')
    } else if (!regForm.pass) {
      blurInput('password')
    }
    if (isValidForm) {
      try {
        const data = await userLogin({ email: regForm.email, password: regForm.pass })
        user.userLogin(data.data)
      } catch (e) {
        console.log(e);
        // console.log(e.response.data.message)
        setErrorAuth(true)
      }
    }
  }

  const editEmail = (val) => {
    setRegForm({ ...regForm, email: val })
    if (validateEmail(val)) {
      setErrorMessage({ ...errorMasage, email: 'Invalid Email' })
    } else {
      setErrorMessage({ ...errorMasage, email: '' })
    }
  }

  let editPass = (val) => {
    setRegForm({ ...regForm, pass: val })
    const validPassLength = (val.length >= 6 && val.length < 15)

    if (validPassLength) {
      setErrorMessage({ ...errorMasage, pass: '', repPass: '' })
    } else {
      setErrorMessage({ ...errorMasage, pass: 'The password must be between 6 and 15 symbols' })
    }
  }

  const blurInput = (inputName) => {
    switch (inputName) {
      case 'email': {
        setWrongValue({ ...wrongValue, email: true })
        break;
      }
      case 'password': {
        setWrongValue({ ...wrongValue, pass: true })
        break;
      }
      default: break;
    }
  }

  return (
    <div className='loginContainer'>
      <form className='loginForm'>
        <h1>Sign In</h1>
        <FormInput className='email-input' name={'email'} blur={blurInput} value={regForm.email} changeValue={editEmail} title='E-mail' />
        {isInvalidEmail && <div className='error-message'>{errorMasage.email}</div>}
        <FormInput className='password-input' name={'password'} type={'password'} blur={blurInput} changeValue={editPass} value={regForm.pass} title='Password' />
        {isInvalidPassword && <div className='error-message'> {errorMasage.pass}</div>}
        <SubmitFormButton title={'Login'} callback={login} />
        {errorAuth && <div className='error-message'> {'Invalid Email or Password'}</div>}
        <div className='note-login'>
          <span> 
            {"Don't have an account? "}
            <Link to={'/user/registration'} className='link_reg'>Registration</Link>
          </span>
        </div>
      </form>
    </div>
  );
})

export default LoginForm;