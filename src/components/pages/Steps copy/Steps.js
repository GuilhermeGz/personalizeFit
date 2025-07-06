import React, { useState, useEffect } from "react";
import "./Steps.css";
import Sidebar from "../SideBar/Sidebar";
import Notificacao from "../Notificacao/Notificacao";
import { FaTrash, FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Steps() {
  const [trainingsList, setTrainingsList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [trainingName, setTrainingName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [series, setSeries] = useState([{ repeticao: "", carga: "", descanso: "" }]); // Inicia com uma série vazia
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false); // Novo estado para o modal
  const navigate = useNavigate();

  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [newTrainingTitle, setNewTrainingTitle] = useState("");
  const [selectedTrainingGroups, setSelectedTrainingGroups] = useState(null);
  const [filteredPresetList, setFilteredPresetList] = useState([]);
  const [activeTrainingId, setActiveTrainingId] = useState(null);
  const token = localStorage.getItem("token");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = exerciseData.slice(indexOfFirstItem, indexOfLastItem);

  const mockExercises = [
    { id: 1, title: "Flexão" },
    { id: 2, title: "Agachamento" },
    { id: 3, title: "Puxada" },
    { id: 4, title: "Supino" },
    { id: 5, title: "Abdominal" },
  ];

  const handleCreateTraining = () => {
    if (trainingName) {
      setTrainingsList([...trainingsList, { id: Date.now(), title: trainingName }]);
      setTrainingName("");
      setStep(2);
    }
  };

  const handleCreateGroup = () => {
    if (groupName) {
      setGroupsList([...groupsList, { id: Date.now(), title: groupName }]);
      setGroupName("");
      setStep(3);
    }
  };

  const handleAddSerie = () => {
    setSeries([...series, { repeticao: "", carga: "", descanso: "" }]);
  };

  const handleRemoveSerie = (index) => {
    setSeries(series.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedSeries = [...series];
    updatedSeries[index][field] = value;
    setSeries(updatedSeries);
  };

  const handleAddExercise = () => {
    if (selectedExercise) {
      setExerciseData([...exerciseData, { title: selectedExercise, series }]);
      setSelectedExercise("");
      setSeries([{ repeticao: "", carga: "", descanso: "" }]); // Reseta a série após salvar
    }
  };

  const handleCancel = () => {
    setStep(1);
    setTrainingName("");
    setGroupName("");
    setSelectedExercise("");
    setGroupsList([]);
    setExerciseData([]);
    setSeries([{ repeticao: "", carga: "", descanso: "" }]); // Reseta a série
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (selectedExercise) {
      setSeries([{ repeticao: "", carga: "", descanso: "" }]); // Sempre inicializa com uma série
    }
  }, [selectedExercise]);

  return (
    <div className="App body">
      <Sidebar />
      <Notificacao />
      <div className="newTreino-content">
        <div className="header">
          <div className="entitiesTreino">
            {step === 1 && "Predefinição do Treino"}
            {step === 2 && `Grupo de Treino`}
            {step === 3 && `FLUXO AQUIIII`}
          </div>
        </div>

        {step === 1 && (
          <div className="step-content">
            <div className="search step1Text">
              <input
                type="text"
                placeholder="Titulo da predefinição"
                value={trainingName}
                onChange={(e) => setTrainingName(e.target.value)}
              />
            </div>
            <div className="buttons">
              <button className="pagination-buttonPrev step1Bt steap1BtC" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="pagination-buttonPos step1Bt" onClick={handleCreateTraining} disabled={!trainingName}>
                Seguir
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <div className="search step1Text">
              <input
                type="text"
                placeholder="Título Grupo de Treino"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            <div className="buttons">
              <button className="pagination-buttonPrev step1Bt steap1BtC" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="pagination-buttonPos step1Bt" onClick={handleCreateGroup} disabled={!groupName}>
                Seguir
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="header">
              <select className="selectTreino" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <div className="entitiesTreino">Exercicios</div>
              <div className="search">
                <input type="text" placeholder="Buscar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button className="create-button-container" onClick={toggleModal}>
                <FaPlus />
              </button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th className="table-title">Título</th>
                  <th className="table-title opc">Opções</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((exercise) => (
                    <React.Fragment key={exercise.title}>
                      <tr>
                        <td>{exercise.title}</td>
                        <td className="opc">
                          <button className="edit-button">
                            <FaEdit /> Editar
                          </button>
                          <button className="edit-button">
                            <FaTrash /> Excluir
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center" }}>Nenhum exercício encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination">
              <button className="pagination-buttonPrev step1Bt steap1BtC" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="pagination-buttonPos step1Bt" onClick={handleCreateGroup} disabled={!groupName}>
                Concluir
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="step3Modal">
            <div className="modal-content">
              <h2 className="modalTitle">Adicionar Séries</h2>
              <table className="exercise-table">
                <thead>
                  <tr>
                    <th className="table-title step3TableT">Série</th>
                    <th className="table-title step3TableT">Repetição</th>
                    <th className="table-title step3TableT">Carga</th>
                    <th className="table-title step3TableT">Descanso</th>
                  </tr>
                </thead>
                <tbody>
                  {series.map((serie, index) => (
                    <tr key={index}>
                      <td className="step3NumRep">{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          placeholder="Repetição"
                          className="step3RepCont"
                          value={serie.repeticao}
                          onChange={(e) => handleInputChange(index, 'repeticao', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Carga"
                          className="step3RepCont"
                          value={serie.carga}
                          onChange={(e) => handleInputChange(index, 'carga', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Descanso"
                          className="step3RepCont"
                          value={serie.descanso}
                          onChange={(e) => handleInputChange(index, 'descanso', e.target.value)}
                        />
                      </td>
                      <td>
                      <FaTrash className="trash" onClick={() => handleRemoveSerie(index)} />

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={handleAddSerie} className="pagination-buttonPos step3BtAdd">Adicionar Série</button>
              <div className="Pagination buttons">
                <button className="cancel-button-step3 pagination-buttonPrev" onClick={toggleModal}>Fechar</button>
                <button className="save-button-step3 pagination-buttonPos" onClick={handleAddExercise}>Salvar Exercício</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Steps;
