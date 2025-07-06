import React, { useState, useEffect } from "react";
import "./NewTreino.css";
import Sidebar from "../SideBar/Sidebar";
import Notificacao from "../Notificacao/Notificacao"; 
import { FaTrash, FaEdit, FaEye, FaPlus, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function NewTreino() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [newTrainingTitle, setNewTrainingTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTrainingGroups, setSelectedTrainingGroups] = useState(null);
  const [filteredPresetList, setFilteredPresetList] = useState([]);
  const [activeTrainingId, setActiveTrainingId] = useState(null); // Novo estado para controlar a visibilidade
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchTrainings = async () => {
    try {
      const response = await fetch(
        "http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingPreset",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Erro ao buscar treinos");
      const data = await response.json();
      setTrainings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleShowDetails = async (trainingId) => {
    // Alterna a visibilidade da linha de detalhes para o treino selecionado
    setActiveTrainingId(prev => (prev === trainingId ? null : trainingId));

    try {
      const response = await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingGroup`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar grupos de treino");
      const data = await response.json();
      setSelectedTrainingGroups(data);

      // Filtrando os grupos de treino para mostrar apenas os relacionados ao trainingId selecionado
      const filteredGroups = data.filter(group => group.trainingPreset.id === trainingId);
      setFilteredPresetList(filteredGroups);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (trainingId) => {
    try {
      const response = await fetch(`http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingPreset/${trainingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao excluir treino");
      setTrainings(trainings.filter(training => training.id !== trainingId));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTrainings = trainings.filter((training) =>
    training.title.toLowerCase().includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTrainings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTrainings.length / itemsPerPage);

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="App body">
      <Sidebar />
      <Notificacao />
      <div className="newTreino-content">
        <div className="header">
          <select className="selectTreino" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <div className="entitiesTreino">Treinos</div>
          <div className="search">
            <input type="text" placeholder="Buscar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="create-button-container" onClick={() => navigate(`/Steps`)}>
            <FaPlus /> 
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="table-title">Nome</th>
              <th className="table-title opc">Opções</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((training) => (
                <React.Fragment key={training.id}>
                  <tr className="clickable-row teste11" onClick={() => handleShowDetails(training.id)}>
  <td>{training.title}</td>
  <td className="opc">
    <button className="edit-button" onClick={(e) => { e.stopPropagation(); navigate(`/StepsVisu`, { state: { id: training.id } }); }}>
      <FaEye /> Entrar
    </button>
    <button className="edit-button" onClick={(e) => { e.stopPropagation(); navigate(`/StepsUpdate`, { state: { id: training.id } }); }}>
      <FaEdit /> Editar
    </button>
    <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleDelete(training.id); }}>
      <FaTrash /> Excluir
    </button>
  </td>
</tr>


                  {/* Exibindo a linha de detalhes abaixo da linha do treino, com transição suave */}
                  {activeTrainingId === training.id && (
  <tr className="details-row">
    <td colSpan="2">
      <div className="details-container">
        {filteredPresetList.length === 0 ? (
          <div className="no-details-message">
            Não existe grupo associado
          </div>
        ) : (
          <>
            <h3>Grupos Associados</h3><br></br>
            <ul>
              {filteredPresetList.map((group) => (
                <li key={group.id}>{group.name.toUpperCase()}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </td>
  </tr>
)}

                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>Nenhum treino encontrado</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button className="pagination-buttonPrev" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button className="pagination-buttonPos" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewTreino;
