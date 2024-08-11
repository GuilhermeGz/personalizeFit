import React from 'react';
import { Link } from 'react-router-dom';
import './CardDivActive.css';

const CardDivActive = ({name}) => {
  return (
    <div className="card-active">
      <div className="card-active-content">
        <div className="card-active-header">
          <span className="card-active-letter">{name}</span>
        </div>
      </div>
    </div>
  );
}

export default CardDivActive;
