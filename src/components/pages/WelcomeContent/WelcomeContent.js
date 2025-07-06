import React from 'react';
import './WelcomeContent.css';
import UserImage from "../../../img/user.jpg"

function WelcomeContent({name}) {
  return (
    <div className="welcome-content">
      <div className="text-container">
        <h2>
          Conteúdo do treinador, <span>{name.toUpperCase()}</span>
        </h2>
        <p>
          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.
          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.
        </p>
      </div>
      <img src={UserImage} alt="Treinador" className="trainer-avatar"/>
      </div>
  );
}

export default WelcomeContent;
