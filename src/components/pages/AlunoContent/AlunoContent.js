import React from 'react';
import './AlunoContent.css';

function AlunoContent() {
  return (
    <div className="aluno-content">
      <h3>Avaliações</h3>
      <ul>
        <li>
          <div className="coach-icon"></div>
          <span>Avaliação 1</span>
        </li>
        <li>
          <div className="coach-icon"></div>
          <span>Avaliação 2</span>
        </li>
        <li>
          <div className="coach-icon"></div>
          <span>Avaliação 3</span>
        </li>
      </ul>
    </div>
  );
}

export default AlunoContent;
