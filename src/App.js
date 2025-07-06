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
import NewPage from './components/pages/New/NewPage';
import NewTreino from './components/pages/NewTreino/NewTreino';
import Steps from './components/pages/Steps/Steps';
import StepsUpdate from './components/pages/StepsUpdate/Steps';
import StepsVisu from './components/pages/StepsVisu/Steps';
import AdminHome from './components/pages/Admin/Home/Home';
import ExerciseList2 from './components/pages/Exercise/List2/ExerciseList';
import ExerciseUpdate from './components/pages/Exercise/Update/Update';
import Profile from './components/pages/Trainer/Perfil/UserProfile';




function App() {
  return (
    <div className="App">
      <BrowserRouter>
      
      

          <Routes>

            <Route exact path="/NewPage" element={<ProtectedRoute element={<NewPage />} requiredRole="trainer-role"  />}  />
            <Route exact path="/NewTreino" element={<ProtectedRoute element={<NewTreino />} requiredRole="trainer-role"  />}  />
            <Route exact path="/Steps" element={<ProtectedRoute element={<Steps />} requiredRole="trainer-role"  />}  />
            <Route exact path="/StepsUpdate" element={<ProtectedRoute element={<StepsUpdate />} requiredRole="trainer-role"  />}  />
            <Route exact path="/StepsVisu" element={<ProtectedRoute element={<StepsVisu />} requiredRole="trainer-role"  />}  />

            <Route exact path="/admin/home" element={<ProtectedRoute element={<AdminHome />} requiredRole="admin-role" />} />


            <Route exact path="/ExerciseList2" element={<ProtectedRoute element={<ExerciseList2 />} requiredRole="admin-role" />} />
            <Route exact path="/ExerciseUpdate" element={<ProtectedRoute  element={<ExerciseUpdate />} requiredRole="admin-role" />} />
            <Route exact path="/Profile" element={<ProtectedRoute  element={<Profile />} />} />



            <Route exact path="/login" element={<Login />} />
            
            <Route exact path="/" element={<Login />} />

            <Route exact path="/signup" element={<Signup />} />

            <Route exact path="/forgot" element={<Forgot />} />

{/* trainer-role */}
{/* admin-role */}
            <Route exact path="/Exercise/List" element={<ProtectedRoute element={<ListExercise />} requiredRole="admin-role"  />} />

            <Route exact path="/Exercise/Create" element={<ProtectedRoute element={<CreateExercise />} requiredRole="admin-role" />}/>

            <Route exact path="/Serie/Create" element={<ProtectedRoute element={<CreateSerie />} requiredRole="trainer-role"  />}/>

            <Route exact path="/Serie/Update" element={<ProtectedRoute element={<UpdateSerie />} requiredRole="trainer-role"  />}/>




            <Route exact path="/Training/Preset" element={<ProtectedRoute element={<PresetTraining />} requiredRole="trainer-role" />}/>

            <Route exact path="/Training/Create" element={<ProtectedRoute element={<CreateTraining />} requiredRole="trainer-role" />}/>

            <Route exact path="/Training/Update" element={<ProtectedRoute element={<UpdateTraining />} requiredRole="trainer-role" />}/>

            <Route exact path="/Training/Group/List" element={<ProtectedRoute element={<GroupListTraining />} requiredRole="trainer-role" />}/>

            <Route exact path="/Training/Preset/Create" element={<ProtectedRoute element={<CreatePreset />} requiredRole="trainer-role" />}/>

            <Route exact path="/Aluno/info" element={<ProtectedRoute element={<InfoAluno />} requiredRole="trainer-role" />}/>

            <Route exact path="/Aluno/Create" element={<ProtectedRoute element={<CreateAluno />} requiredRole="trainer-role" />}/>

            <Route exact path="/Aluno/Association" element={<ProtectedRoute element={<AssociationAluno />} requiredRole="trainer-role" />}/>

            <Route exact path="/Trainer/Students" element={<ProtectedRoute element={<TrainerStudents />} requiredRole="trainer-role" />}/>

            <Route exact path="/Training/Association" element={<ProtectedRoute element={<AssociationTraining />} requiredRole="trainer-role" />}/>

            <Route exact path="/Trainer/Home" element={<ProtectedRoute element={<HomeTrainer />} requiredRole="trainer-role" />}/>

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
