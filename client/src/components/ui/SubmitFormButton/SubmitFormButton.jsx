import './SubmitFormButton.scss'

const SubmitFormButton = ({title, callback}) => {

  return (  
		<div className="buttonContainer">
				<button className='submitFormButton' onClick={callback}>{title}</button>
		</div>
)
}

export default SubmitFormButton;
