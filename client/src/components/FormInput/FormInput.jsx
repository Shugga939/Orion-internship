import './FormInput.scss'

function FormInput({name, type='text', title, value, changeValue, blur}) {

  return (
    <div className = 'txt_field'>
      <input type={type} 
        className = 'inputForm'
        required 
        placeholder = {title}
        value = {value} name = {name}
        onChange = {event => changeValue(event.target.value)} 
        onBlur={(e)=>blur(e.currentTarget.name)}/>
      <span></span>
    </div>
  );
}

export default FormInput;