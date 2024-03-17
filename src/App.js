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
import UpdateTraining from './components/pages/Training/Update/Update';
import GroupListTraining from './components/pages/Training/Group/List/List';
import CreatePreset from "./components/pages/Training/Preset/Create/Create";
import UpdateSerie from "./components/pages/Series/Update/Update";
import Navbar from "./Navbar";
import InfoAluno from "./components/pages/Aluno/info/Info"
import CreateAluno from "./components/pages/Aluno/Create/Create"


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route exact path="/" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/forgot" element={<Forgot />} />

          <Route path="/Exercise/List" element={<ListExercise />} />

          <Route path="/Exercise/Create" element={<CreateExercise />} />

          <Route path="/Serie/Create" element={<CreateSerie />} />

          <Route path="/Serie/Update" element={<UpdateSerie />} />

          <Route path="/Training/Preset" element={<PresetTraining />} />

          <Route path="/Training/Create" element={<CreateTraining />} />

          <Route path="/Training/Update" element={<UpdateTraining />} />

          <Route path="/Training/Group/List" element={<GroupListTraining />} />

          <Route path="/Training/Preset/Create" element={<CreatePreset />} />

          <Route path="/Aluno/info" element={<InfoAluno />} />

          <Route path="/Aluno/Create" element={<CreateAluno />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
