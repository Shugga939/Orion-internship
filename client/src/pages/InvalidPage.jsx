import { observer } from "mobx-react-lite";
import './Pages.scss'

const InvalidPage = observer(()=> { 

  return (
    <div className = 'invalidPage'>
      <h1 className="notice">Invalid Room</h1>
    </div>
  );
})

export default InvalidPage;