import React from 'react';
import { Link } from 'react-router-dom';
import './CardWhite.css';

const CardWhite = ({content, children}) => {
  return (
    <div className="card-white">
      <div className="card-white-content">
        <div className="card-white-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default CardWhite;
