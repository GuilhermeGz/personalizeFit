import React, { useState, useEffect } from "react";
import { FaDumbbell, FaClock, FaArrowRight, FaArrowLeft, FaExchangeAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./Exercise.css";
import CardWhite2 from "../../Cards/Divisao/CardWhite2";

const Exercise = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state && location.state.userData;
  const userExercises = location.state && location.state.exercises;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseName, setExerciseName] = useState("");
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  const currentExercise = userExercises[currentExerciseIndex];

  useEffect(() => {
    fetchExerciseName(currentExercise.exerciseId);
  }, [userExercises, currentExerciseIndex]);

  const fetchExerciseName = async (id) => {
    const name = await getNameExercise(id);
    setExerciseName(name);
  };

  const handleNextExercise = () => {
    setCurrentExerciseIndex((prevIndex) => (prevIndex + 1) % userExercises.length);
    setCurrentSetIndex(0); // Reset to first set when changing exercise
  };

  const handlePreviousExercise = () => {
    setCurrentExerciseIndex((prevIndex) => (prevIndex - 1 + userExercises.length) % userExercises.length);
    setCurrentSetIndex(0); // Reset to first set when changing exercise
  };

  const handleNextSet = () => {
    setCurrentSetIndex((prevIndex) => (prevIndex + 1) % parsedTrainingSets.length);
  };

  const handlePreviousSet = () => {
    setCurrentSetIndex((prevIndex) => (prevIndex - 1 + parsedTrainingSets.length) % parsedTrainingSets.length);
  };

  const getNameExercise = async (id) => {
    try {
      const response = await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise/${id}`, {
        headers: {
          'Authorization': `Bearer ${userData.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.name;

    } catch (error) {
      console.error('Erro ao buscar o nome do exercício:', error);
      return null;
    }
  };

  const ClickExerciseEqui = (exercises) => {
    navigate(`/Aluno/Equivalent`, {state: { userData: userData, exercises: exercises, id: currentExercise.exerciseId}});
  };

  const parsedTrainingSets = JSON.parse(currentExercise.trainingSetJsonString);

  return (
    <div className="main">
      <div className="trainer-info">
        <div className="trainer-profile">
          <img src="treinador.jpg" alt="Treinador" />
          <div className="trainer-details">
            <h1>Aluno Corno</h1>
            <p>Idade: 30 anos</p>
          </div>
        </div>
      </div>
      <div className="title">
        <div className="underline"></div>
      </div>
      <div className="content">
        <CardWhite2>
          <div className="exercise-header">
            <div className="icons-exercise">
              <FaExchangeAlt className="change-exercise" size={50} onClick={() => ClickExerciseEqui(currentExercise)} />
              <svg className="info-exercise" width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.75 1.97027C7.10531 1.97027 1.71875 7.55747 1.71875 14.4497C1.71875 21.3418 7.10531 26.929 13.75 26.929C20.3947 26.929 25.7812 21.3418 25.7812 14.4497C25.7812 7.55747 20.3947 1.97027 13.75 1.97027ZM0 14.4497C0 6.57267 6.15588 0.1875 13.75 0.1875C21.3441 0.1875 27.5 6.57267 27.5 14.4497C27.5 22.3266 21.3441 28.7118 13.75 28.7118C6.15588 28.7118 0 22.3266 0 14.4497ZM13.75 11.5972C14.2244 11.5972 14.6094 11.9966 14.6094 12.4886V21.4025C14.6094 21.6389 14.5188 21.8656 14.3577 22.0328C14.1965 22.1999 13.9779 22.2938 13.75 22.2938C13.5221 22.2938 13.3035 22.1999 13.1423 22.0328C12.9812 21.8656 12.8906 21.6389 12.8906 21.4025V12.4886C12.8906 11.9966 13.2756 11.5972 13.75 11.5972ZM13.75 9.4579C14.1147 9.4579 14.4644 9.30764 14.7223 9.04017C14.9801 8.7727 15.125 8.40994 15.125 8.03168C15.125 7.65343 14.9801 7.29066 14.7223 7.0232C14.4644 6.75573 14.1147 6.60547 13.75 6.60547C13.3853 6.60547 13.0356 6.75573 12.7777 7.0232C12.5199 7.29066 12.375 7.65343 12.375 8.03168C12.375 8.40994 12.5199 8.7727 12.7777 9.04017C13.0356 9.30764 13.3853 9.4579 13.75 9.4579Z" fill="#1D3557"/>
              </svg>
            </div>
            <h2>{exerciseName || "Carregando..."}</h2>
          </div>
          <div className="exercise-row">
            <FaDumbbell className="dumbell dumbbell-exercise" size={200} />
            <div className="icon-row">
              <button className="next-exercise-button" onClick={handleNextExercise}>
                <FaArrowRight />
              </button>
            </div>
          </div>
          <p>Observação: {currentExercise.observation}</p>
          <h3>-------</h3>
    
            <div className="training-set-container">
              
              <div className="training-set">
                <p className="black-letter">{parsedTrainingSets[currentSetIndex].repeticao} Repetições</p>
                <p className="black-letter">{parsedTrainingSets[currentSetIndex].carga} Kg de carga</p>
              </div>

              <div>
                <p className="blue-letter rest-label">Descanso</p>
              </div>
            
              <div className="rest">
                <svg width="35" height="30" viewBox="0 0 55 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3336 3.125C19.3336 2.2962 19.7409 1.50134 20.4659 0.915291C21.191 0.32924 22.1743 0 23.1996 0L30.9316 0C31.9569 0 32.9402 0.32924 33.6652 0.915291C34.3902 1.50134 34.7975 2.2962 34.7975 3.125C34.7975 3.9538 34.3902 4.74866 33.6652 5.33471C32.9402 5.92076 31.9569 6.25 30.9316 6.25V6.46875C34.8099 6.91773 38.5201 8.04612 41.8027 9.775L45.313 6.9375C45.5785 6.70723 45.8986 6.52253 46.2542 6.39443C46.6099 6.26633 46.9938 6.19745 47.3832 6.1919C47.7725 6.18635 48.1592 6.24424 48.5202 6.36212C48.8813 6.47999 49.2092 6.65545 49.4845 6.878C49.7599 7.10056 49.9769 7.36567 50.1228 7.65751C50.2686 7.94935 50.3402 8.26194 50.3333 8.57663C50.3265 8.89133 50.2413 9.20168 50.0828 9.48918C49.9243 9.77668 49.6958 10.0354 49.4109 10.25L46.3182 12.75C50.5953 16.2513 53.287 20.8161 53.9586 25.7066C54.6301 30.5972 53.2422 35.528 50.019 39.7022C46.7959 43.8765 41.9258 47.0504 36.1956 48.7112C30.4655 50.372 24.21 50.4226 18.4399 48.8549C12.6697 47.2871 7.72203 44.1926 4.39616 40.0714C1.07029 35.9501 -0.439459 31.0428 0.110838 26.1423C0.661135 21.2419 3.23934 16.6345 7.42888 13.0646C11.6184 9.49481 17.1746 7.17102 23.1996 6.46875V6.25C22.1743 6.25 21.191 5.92076 20.4659 5.33471C19.7409 4.74866 19.3336 3.9538 19.3336 3.125ZM48.3285 28.125C48.3285 32.6834 46.0883 37.0551 42.1007 40.2784C38.1132 43.5017 32.7049 45.3125 27.0656 45.3125C21.4263 45.3125 16.018 43.5017 12.0305 40.2784C8.04289 37.0551 5.8027 32.6834 5.8027 28.125C5.8027 23.5666 8.04289 19.1949 12.0305 15.9716C16.018 12.7483 21.4263 10.9375 27.0656 10.9375C32.7049 10.9375 38.1132 12.7483 42.1007 15.9716C46.0883 19.1949 48.3285 23.5666 48.3285 28.125ZM29.9651 17.9688C29.9651 17.3471 29.6596 16.751 29.1158 16.3115C28.5721 15.8719 27.8346 15.625 27.0656 15.625C26.2966 15.625 25.5591 15.8719 25.0153 16.3115C24.4716 16.751 24.1661 17.3471 24.1661 17.9688V29.0938L25.0166 29.7812L33.7305 36.825C33.996 37.0553 34.3161 37.24 34.6718 37.3681C35.0274 37.4962 35.4114 37.565 35.8007 37.5706C36.19 37.5762 36.5767 37.5183 36.9377 37.4004C37.2988 37.2825 37.6267 37.1071 37.9021 36.8845C38.1774 36.6619 38.3945 36.3968 38.5403 36.105C38.6861 35.8132 38.7577 35.5006 38.7509 35.1859C38.744 34.8712 38.6588 34.5608 38.5003 34.2733C38.3418 33.9858 38.1133 33.7271 37.8285 33.5125L29.9651 27.1531V17.9688Z" fill="#1D3557"/>
                </svg>
                <p className="blue-letter rest-text"> {parsedTrainingSets[currentSetIndex].descanso} segundos</p>
              </div>

              <button className="prev-set-button" onClick={handlePreviousSet}>
                <FaArrowLeft />
              </button>
              <button className="next-set-button" onClick={handleNextSet}>
                <FaArrowRight />
              </button>
            </div>
    
        </CardWhite2>
      </div>
    </div>
  );
};

export default Exercise;
