import React, { useState, useEffect } from "react";
import Sidebar from "../../SideBar/Sidebar";
import Notificacao from "../../Notificacao/Notificacao";
import { FaEye, FaSearch,FaPlus,FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ExerciseList.css";
import { jwtDecode } from "jwt-decode";

function ExerciseList() {
  const [exerciseList, setExerciseList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const decoded = jwtDecode(token);
    console.log(decoded.realm_roles[0]);
    const fetchExerciseList = async () => {
      try {
        const response = await fetch(
          "http://gaetec-server.tailf2d209.ts.net:8000/exercise/api/Exercise",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setExerciseList(data);
      } catch (error) {
        console.error("Erro ao buscar exercícios:", error);
      }
    };

    fetchExerciseList();
  }, []);

  const filteredExercises = exerciseList.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExercises.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExercises.length / itemsPerPage);

  return (
    <div className="App body">
      <Sidebar  />
      <Notificacao />
      <div className="newTreino-content">
        <div className="header">
          <select
            className="selectTreino"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <div className="entitiesTreino">Exercícios</div>
          <div className="search">
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <button className="create-button-container" onClick={() => navigate(`/Exercise/Create`)}>
                      <FaPlus /> 
                    </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="table-title">Nome</th>
              <th className="table-title">Grupo Muscular</th>
              <th className="table-title opc">Opções</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((exercise) => (
                <tr key={exercise.id}>
                  <td>{exercise.name}</td>
                  <td>{exercise.muscularGroup?.name || "-"}</td>
                  <td className="opc">
                      {/* <button className="edit-button" onClick={(e) => { e.stopPropagation(); navigate(`/StepsVisu`, { state: { id: exercise.id } }); }}>
                        <FaEye /> Visualizar
                      </button> */}
                      <button className="edit-button" onClick={(e) => { e.stopPropagation(); navigate(`/ExerciseUpdate`, { state: { id: exercise.id } }); }}>
                        <FaEdit /> Editar
                      </button>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  Nenhum exercício encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button
            className="pagination-buttonPrev"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="pagination-buttonPos"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExerciseList;
