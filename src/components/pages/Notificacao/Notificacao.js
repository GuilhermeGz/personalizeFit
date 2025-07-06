import React from "react";
import { FaBell } from "react-icons/fa";
import "./Notificacao.css";

function Notificacao() {
  return (
    <div className="notificacao">
      <FaBell className="notificacao-icon" />
      <span className="notificacao-text">Notificação</span>
    </div>
  );
}

export default Notificacao;
