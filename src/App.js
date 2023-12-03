import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom'

//Components
import Signup from './components/pages/signup/Signup';
import Forgot from './components/pages/forgot/Forgot';
import Login from './components/pages/login/Login'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgot' element={<Forgot />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
