import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import GradeService from "../../services/GradeService";
import { Grade } from "../../types";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";

const GradeList = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [error, setError] = useState<string>("");
  const fetchData = async () => {
    try {
      const response = await GradeService.getAllGrades();
      if (response.success) {
        setGrades(response.data);
      } else {
        setError("Failed to fetch grades");
      }
    } catch (error) {
      setError("Failed to fetch grades");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      confirmAlert({
        title: "Eliminar",
        message: "Esta seguro de eliminar este registro?",
        buttons: [
          {
            label: "Si",
            onClick: () =>
              toast.promise(
                GradeService.deleteGrade(id).then((response) => {
                  if (response.success) {
                    fetchData();
                  }
                }),
                {
                  loading: "Eliminando...",
                  success: "Eliminado correctamente!",
                  error: <b>Error al eliminar.</b>,
                }
              ),
          },
          {
            label: "No",
          },
        ],
      });
    } catch (error) {
      setError("Failed to delete grade");
    }
  };

  return (
    <div>
      <h1>Grados</h1>
      {error && <p>{error}</p>}
      <div className="col c_ButtonAdd">
        <Link className="btn btn-primary" to="/grades/add">
          Agregar
        </Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Seccion</th>
            <th>Descipcion</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade.gradeId}>
              <td className="c_padding2">{grade.name}</td>
              <td className="c_padding2">{grade.section}</td>
              <td className="c_padding2">{grade.description}</td>
              <td>
                <Link
                  className="btn btn-primary c_margin1"
                  to={`/grades/edit/${grade.gradeId}`}
                >
                  Editar
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(grade.gradeId)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradeList;
