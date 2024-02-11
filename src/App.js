import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom'

//Components
import Signup from './components/pages/signup/Signup';
import Forgot from './components/pages/forgot/Forgot';
import Login from './components/pages/login/Login'
import PresetTraining from './components/pages/Training/Preset/Preset';
import CreateTraining from './components/pages/Training/Create/Create';
import ListExercise from './components/pages/Exercise/List/List';
import CreateSerie from './components/pages/Series/Create/Create';
import CreateExercise from './components/pages/Exercise/Create/Create';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgot' element={<Forgot />} />

          {/* ok */}
          <Route path='/Training/Preset' element={<PresetTraining />} />

           {/* ok */}
          <Route path='/Training/Create' element={<CreateTraining />} />

          {/* ok */}
          <Route path='/Exercise/List' element={<ListExercise />} />

          {/* ok */}
          <Route path='/Serie/Create' element={<CreateSerie />} />

          {/* ok */}
          <Route path='/Exercise/Create' element={<CreateExercise />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
