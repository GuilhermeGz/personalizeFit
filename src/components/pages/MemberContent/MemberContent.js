import React, { useState, useEffect } from "react";
import "./MemberContent.css";
import NewAluno from "../../pages/NewAluno/NewAluno";
import { FaDumbbell } from "react-icons/fa";
import NewPreset from "../NewPreset/NewPreset";

function MemberContent({ students }) {
  const [allPlans, setAllPlans] = useState([]);
  const [plans, setPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen2, setModalOpen2] = useState(false);
  const [selectedAlunoPresets, setSelectedAlunoPresets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [studentPresetsMap, setStudentPresetsMap] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://gaetec-server.tailf2d209.ts.net:8000/training/api/TrainingPreset", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const map = {};
      data.forEach((preset) => {
        preset.studentHasTrainingPresets.forEach((rel) => {
          if (!map[rel.studentId]) map[rel.studentId] = [];
          map[rel.studentId].push({ id: preset.id, title: preset.title });
        });
      });
      setStudentPresetsMap(map);
    } catch (err) {
      console.error("Erro ao buscar presets:", err);
    }
  };

  useEffect(() => {
    if (students.length > 0) {
      const formattedPlans = students.map((student) => ({
        planName: student.username || "Sem Nome",
        id: student.id || "Sem id",
        validity: student.plan || "---",
        amount: student.active ? "Ativo" : "Inativo",
        isActive: student.active ?? false,
      }));
      setPlans(formattedPlans);
      setAllPlans(formattedPlans);
    }
  }, [students]);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(1);
    setPlans(value === "" ? allPlans : allPlans.filter((p) => p.planName.toLowerCase().includes(value)));
  };

  const handleTrainingClick = (studentId) => {
    const presets = studentPresetsMap[studentId] || [];
    setSelectedAlunoPresets(presets);
    setModalOpen2(true);
  };

  const handleToggleClick = (index) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan, i) =>
        i === index ? { ...plan, isActive: !plan.isActive, amount: !plan.isActive ? "Ativo" : "Inativo" } : plan
      )
    );
  };

  const handleEditClick = (aluno) => {
    setSelectedAluno(aluno);
    setModalOpen(true);
  };

  const handleSave = (updatedAluno) => {
    console.log("Aluno atualizado:", updatedAluno);
    setModalOpen(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = plans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(plans.length / itemsPerPage);

  return (
    <div className="member-content">
      <div className="header">
        <div className="entities">
          Alunos
          <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div className="search">
          <input type="text" placeholder="Buscar" value={searchTerm} onChange={handleSearchChange} />
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th className="table-title">Nome</th>
            <th className="table-title">Treino</th>
            <th className="table-title">Status</th>
            <th className="table-title">Opções</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((plan, index) => (
              <tr key={index} className="teste12">
                <td>{plan.planName}</td>
                <td>{plan.validity}</td>
                <td>{plan.amount}</td>
                <td className="opc">
                  <button
                    className="edit-button"
                    onClick={() =>
                      handleEditClick({
                        username: plan.planName,
                        validity: plan.validity,
                        status: plan.amount,
                      })
                    }
                  >
                    Editar
                  </button>
                  <button className="training-button" onClick={() => handleTrainingClick(plan.id)}>
                    <FaDumbbell />
                  </button>
                  <button
                    className={`toggle-button ${plan.isActive ? "active" : "inactive"}`}
                    onClick={() => handleToggleClick(index)}
                  >
                    {plan.isActive ? "Ativo" : "Inativo"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>Nenhum aluno encontrado</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Anterior</button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</button>
      </div>

      <NewAluno
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        alunoData={selectedAluno}
      />

      <NewPreset
        isOpen={isModalOpen2}
        onClose={() => setModalOpen2(false)}
        presets={selectedAlunoPresets}
      />
    </div>
  );
}

export default MemberContent;
