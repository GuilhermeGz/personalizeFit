import React from 'react';
import { Link } from 'react-router-dom';
import './CardTreino.css';

const CardTreino = ({name}) => {
  return (
    <div className="card-off">
      <div className="card-off-content">
        <div className="card-off-header">
          <span className="card-off-letter">{name}</span>
        </div>
      </div>
    </div>
  );
}

export default CardTreino;
