import React, { useEffect, useState } from "react";
import { GradeStudents } from "../../types";
import { GradeService } from "../../services";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Pagination } from "../../components/Pagination";
import { itemsPerPage } from "../../const/Pagination";
import ModalStudentGrade from "./ModalStudentGrade";

interface RouteParams {
  id: string;
  [key: string]: string | undefined; // Añadir firma de índice
}

const StudentsGrade = () => {
  const { id } = useParams<RouteParams>();
const [gradeStudent, setGradeStudent] = useState<GradeStudents>();

  const [error, setError] = useState<string>("");
  const [show, setShow] = useState(false);

  const [currentPage,setCurrentPage] = useState(1);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleModalOpen = async () => {
    handleShow();
   
  };

  const fetchData = async () => {
    try {
      const response = await GradeService.getStudents(Number(id),currentPage);
      if (response.success) {
        console.log(response.data);
        setGradeStudent(response.data);
      } else {
        setError("Failed to fetch grades");
      }
    } catch (error) {
      setError("Failed to fetch grades");
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);

 
  return (
    <div>
      <h1>Lista de Estudiantes</h1>
      {error && <p>{error}</p>}
      <div className="col c_ButtonAdd">
        <Button className="btn btn-primary" onClick={handleModalOpen}>
          Modificar Estudiantes de {gradeStudent?.grade.name}{" "}
          {gradeStudent?.grade.section}
        </Button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Apellido</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gradeStudent?.students.map((student) => (
            <tr key={student.id + "grade"}>
              <td className="c_padding2">{student.firstName}</td>
              <td className="c_padding2">{student.lastName}</td>

              <td>
                <button className="btn btn-primary c_margin1">Ver Notas</button>
                <button className="btn btn-primary c_margin1">
                  Agregar Observaciones
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
           <Pagination
        currentPage={currentPage}
        lastPage={gradeStudent?gradeStudent?.pagination.totalPages:0}
        maxLength={itemsPerPage}
        setCurrentPage={setCurrentPage}
      />
      {show &&
      <ModalStudentGrade gradeStudent={gradeStudent} handleClose={handleClose} fetchData={fetchData}></ModalStudentGrade>
      }
    
    </div>
  );
};

export default StudentsGrade;
