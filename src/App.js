import './App.css';
import { Link } from "react-router-dom";

function App(props) {
  return (
    <div className="App">
      <Link to={'/guild'}><button>길드 검색</button></Link><br/>
    </div>
  );
}

export default App;
