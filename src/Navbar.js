import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/">Login</Link></li>
        <li className="navbar-item"><Link to="/signup">Signup</Link></li>
        <li className="navbar-item"><Link to="/forgot">Recuperar Senha</Link></li>
        <li className="navbar-item"><Link to="/Training/Preset">Preset De Treinos</Link></li>
        <li className="navbar-item"><Link to="/Exercise/Create">Solicitar Exercicio</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
