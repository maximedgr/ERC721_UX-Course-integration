import './App.css';
import {BrowserRouter as Router} from "react-router-dom"; 
import AppRoutes from "./components/Routes.js"; 
import Navbar from './utils/Navbar';
import Connect from './utils/Connect';

function App() {
  return (
    <div className="App">
      <div className='buttonconnect'>
        <button onClick={Connect}>Connect wallet</button>
      </div>
        <Router>
          <Navbar/>
          <AppRoutes />
        </Router>  
    </div>
  );
}

export default App;
