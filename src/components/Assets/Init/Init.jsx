import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import Logo from '../../../img/Anderson.png'; 
import LogoText from '../../../img/image3.png'; 

const Init = ({ children }) => {
  return (
    <div className='login-container'>
      <div className='login-card'>
        {/* <div className='login-form'> */}
          {children}          
        {/* </div> */}
        <div className='login-logo'>
          <img src={Logo} alt="Logo Image" />
          <img src={LogoText} alt="Logo Text" />
        </div>
      </div>
    </div>
  );
};

export default Init;
