import { useState } from 'react';
import { useRef } from 'react/cjs/react.development';
import './FilePanel.scss'


const FilePanel = ({show}) => {
  const [filesArray, setFilesArray] = useState([])
  let fileInput = useRef()

  const addFile = ()=> {
    setFilesArray([...filesArray, fileInput.current.files])
    console.log(filesArray)
  }

	return (
    <div className={show? "filePanel" : "filePanel hide"}> 
      <div className="filePanelContainer">
      {filesArray.map((el)=>{
        return (
          <div className="fileContainer" key={el[0].name}>
            <div className="uploadedFile">
              <div className="fileImg"></div>
              <div className="text">{el[0].name}</div>
              
            </div>
        </div>
        )
      })}
        <div className="fileContainer">
          <label className="addFile">
            <div className="square"></div>
            <div className="text">Add Files</div>
            <input type="file" ref={fileInput} onChange={addFile} />
          </label>
        </div>
      </div>
    </div>
	)
}

export default FilePanel;

