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
import AssociationAluno from './components/pages/Aluno/Association/Association';
import TrainerStudents from './components/pages/Trainer/Students/Students'
import AssociationTraining from './components/pages/Training/Association/Association' 
import HomeTrainer from './components/pages/Trainer/Home/Home'
import HomeAluno from './components/pages/Aluno/Home/Home'
import ProtectedRoute from './ProtectedRoute';
import AlunoTraining from './components/pages/Aluno/Training/Training';
import AlunoExercise from './components/pages/Aluno/Exercise/Exercise';
import AlunoEquivalent from './components/pages/Aluno/Equivalent/Equivalent';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      
        <Routes>
            <Route exact path="/login" element={<Login />} />
            
            <Route exact path="/" element={<Login />} />

            <Route exact path="/signup" element={<Signup />} />

            <Route exact path="/forgot" element={<Forgot />} />
        </Routes>

          <Routes>
            
            <Route exact path="/Exercise/List" element={<ProtectedRoute element={<ListExercise />} />} />

            <Route exact path="/Exercise/Create" element={<ProtectedRoute element={<CreateExercise />} />}/>

            <Route exact path="/Serie/Create" element={<ProtectedRoute element={<CreateSerie />} />}/>

            <Route exact path="/Serie/Update" element={<ProtectedRoute element={<UpdateSerie />} />}/>



            <Route exact path="/Training/Preset" element={<ProtectedRoute element={<PresetTraining />} />}/>

            <Route exact path="/Training/Create" element={<ProtectedRoute element={<CreateTraining />} />}/>

            <Route exact path="/Training/Update" element={<ProtectedRoute element={<UpdateTraining />} />}/>

            <Route exact path="/Training/Group/List" element={<ProtectedRoute element={<GroupListTraining />} />}/>

            <Route exact path="/Training/Preset/Create" element={<ProtectedRoute element={<CreatePreset />} />}/>

            <Route exact path="/Aluno/info" element={<ProtectedRoute element={<InfoAluno />} />}/>

            <Route exact path="/Aluno/Create" element={<ProtectedRoute element={<CreateAluno />} />}/>

            <Route exact path="/Aluno/Association" element={<ProtectedRoute element={<AssociationAluno />} />}/>

            <Route exact path="/Trainer/Students" element={<ProtectedRoute element={<TrainerStudents />} />}/>

            <Route exact path="/Training/Association" element={<ProtectedRoute element={<AssociationTraining />} />}/>

            <Route exact path="/Trainer/Home" element={<ProtectedRoute element={<HomeTrainer />} />}/>

            <Route exact path="/Aluno/Home" element={<ProtectedRoute element={<HomeAluno />} />}/>

            <Route exact path="/Aluno/Training" element={<ProtectedRoute element={<AlunoTraining />} />}/>

            <Route exact path="/Aluno/Exercise" element={<ProtectedRoute element={<AlunoExercise />} />}/>

            <Route exact path="/Aluno/Equivalent" element={<ProtectedRoute element={<AlunoEquivalent />} />}/>

          </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
