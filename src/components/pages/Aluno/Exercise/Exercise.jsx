import React, { useState, useEffect } from "react";
import { FaDumbbell, FaClock, FaArrowRight, FaArrowLeft, FaExchangeAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./Exercise.css";
import CardWhite2 from "../../Cards/Divisao/CardWhite2";
import ReactPlayer from 'react-player';
import CustomIcon from './CustomIcon';
import CustomIcon2 from './CustomIcon2';

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
    console.log(currentExercise);
  }, [userExercises, currentExerciseIndex]);

  // Carregar imagem
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/ExerciseHasFile/1`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        const { fileId } = data;

        if (fileId) {
          const imageResponse = await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/file/api/file/${fileId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const fileData = await imageResponse.json();

          console.log(fileData);

          if (fileData.extension === 'jpg') {
            console.log("setou não");
            const { fileBytes } = fileData;
            const imageObjectURL = `data:image/${fileData.extension};base64,${fileBytes}`;
            setImageUrl(imageObjectURL);
          } else if (fileData.extension === 'url') {
            setVideoUrl(fileData.path);
            console.log("setou");
            console.log(videoUrl);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };

    fetchImageData();
  }, [token]);

  const fetchExerciseName = async (id) => {
    const name = await getNameExercise(id);
    setExerciseName(name);
  };

  const handleNextExercise = () => {
    setCurrentExerciseIndex((prevIndex) => (prevIndex + 1) % userExercises.length);
    setCurrentSetIndex(0);
  };

  const handlePreviousExercise = () => {
    setCurrentExerciseIndex((prevIndex) => (prevIndex - 1 + userExercises.length) % userExercises.length);
    setCurrentSetIndex(0); 
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
          'Authorization': `Bearer ${token}`
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
              <CustomIcon2 />
            </div>
            <h2>{exerciseName || "Carregando..."}</h2>
          </div>
          {/* Imagem do exercício */}
          {videoUrl ? (
            <div className="exercise-row url-row">
              <div className="video-container">
                <ReactPlayer url={videoUrl} controls={true} className="video-container2"/>
              </div>
              <div className="icon-row">
                {userExercises.length > 1 && currentExerciseIndex < userExercises.length - 1 && (
                  <button className="next-exercise-button" onClick={handleNextExercise}>
                    <FaArrowRight />
                  </button>
                )}
              </div>
            </div>
          ) : imageUrl ? (
            <div className="exercise-row">
              <img src={imageUrl} alt="Exercise" className="dumbbell-exercise" style={{ width: 200 }} />
              <div className="icon-row">
                {userExercises.length > 1 && currentExerciseIndex > 0 && (
                  <button className="prev-exercise-button" onClick={handlePreviousExercise}>
                    <FaArrowLeft />
                  </button>
                )}
                {userExercises.length > 1 && currentExerciseIndex < userExercises.length - 1 && (
                  <button className="next-exercise-button" onClick={handleNextExercise}>
                    <FaArrowRight />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="exercise-row">
              <FaDumbbell className="dumbbell-exercise" size={200} />
              <div className="icon-row">
                {userExercises.length > 1 && currentExerciseIndex > 0 && (
                  <button className="prev-exercise-button" onClick={handlePreviousExercise}>
                    <FaArrowLeft />
                  </button>
                )}
                {userExercises.length > 1 && currentExerciseIndex < userExercises.length - 1 && (
                  <button className="next-exercise-button" onClick={handleNextExercise}>
                    <FaArrowRight />
                  </button>
                )}
              </div>
            </div>
          )}
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
              <CustomIcon />
              <p className="blue-letter rest-text"> {parsedTrainingSets[currentSetIndex].descanso} segundos</p>
            </div>
            {/* Verifica se o índice atual é maior que 0 para mostrar o botão "Anterior" */}
            {currentSetIndex > 0 && (
              <button className="prev-set-button" onClick={handlePreviousSet}>
                <FaArrowLeft />
              </button>
            )}
            {/* Verifica se o índice atual é menor que o total de sets menos 1 para mostrar o botão "Próximo" */}
            {currentSetIndex < parsedTrainingSets.length - 1 && (
              <button className="next-set-button" onClick={handleNextSet}>
                <FaArrowRight />
              </button>
            )}
          </div>
        </CardWhite2>
      </div>
    </div>
  );
};

export default Exercise;
