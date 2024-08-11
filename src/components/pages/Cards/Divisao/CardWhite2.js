import React from 'react';
import { Link } from 'react-router-dom';
import './CardWhite2.css';

const CardWhite = ({content, children}) => {
  return (
    <div className="card-white2">
      <div className="card-white2-content">
        <div className="card-white2-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default CardWhite;
