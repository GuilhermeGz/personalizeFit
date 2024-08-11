import React from 'react';
import { Link } from 'react-router-dom';
import './CardDivAtual.css';

const CardDivAtual = ({name}) => {
  return (
    <div className="card-atual">
      <div className="card-atual-content">
        <div className="card-atual-header">
          <span className="card-atual-letter">{name}</span>
        </div>
      </div>
    </div>
  );
}

export default CardDivAtual;
