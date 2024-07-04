import React, { useEffect, useState } from "react";
import { GradeStudents } from "../../types";
import { GradeService } from "../../services";
import { useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { Pagination } from "../../components/Pagination";
import { itemsPerPage } from "../../const/Pagination";
import ModalStudentGrade from "./ModalStudentGrade";
import ModalNotes from "./Notes/ModalNotes";
import ModalObservations from "./Observations/ModalObservations";
import ModalAbsence from "./Absences/ModalAbsences";

interface RouteParams {
  id: string;
  [key: string]: string | undefined;
}

const StudentsGrade = () => {
  const { id } = useParams<RouteParams>();
  const [gradeStudent, setGradeStudent] = useState<GradeStudents>();
  const [showGrades, setShowGrades] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [show, setShow] = useState(false);
  const [showObservations, setShowObservations] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseGrades = () => setShowGrades(false);
  const handleCloseObservations = () => setShowObservations(false);
  const handleCloseAttendance = () => setShowAttendance(false);

  const handleModalOpen = async () => {
    handleShow();
  };
  const handleShowGrades = (studentId: number) => {
    setSelectedStudentId(studentId);
    setShowGrades(true);
  };
  const handleShowObservations = (studentId: number) => {
    setSelectedStudentId(studentId);
    setShowObservations(true);
  };
  const handleShowAttendance = (studentId: number) => {
    setSelectedStudentId(studentId);
    setShowAttendance(true);
  };

  const fetchData = async (query: string = "") => {
    try {
      setLoading(true);
      const response = await GradeService.getStudents(
        Number(id),
        currentPage,
        query
      );
      if (response.success) {
        setGradeStudent(response.data);
      } else {
        setError("Failed to fetch grades");
      }
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch grades");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData(searchQuery);
  };

  return (
    <div>
      <h1>Lista de Estudiantes</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar estudiante"
        />
        <button type="submit">Buscar</button>
      </form>
      <div className="col c_ButtonAdd">
        <Button className="btn btn-primary" onClick={handleModalOpen}>
          Modificar Estudiantes de {gradeStudent?.grade.name}{" "}
          {gradeStudent?.grade.section}
        </Button>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Padres</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gradeStudent?.students.map((student) => (
                <tr key={student.id + "grade"}>
                  <td className="c_padding1">{student.firstName}</td>
                  <td className="c_padding1">{student.lastName}</td>
                  <td className="c_padding1">
                    {student.parents
                      .map(
                        (parent) =>
                          `${parent.firstName} ${parent.lastName} - (${parent.email})`
                      )
                      .join(", ")}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary c_margin1"
                      onClick={() => handleShowGrades(student.id)}
                    >
                      Ver Notas
                    </button>
                    <button
                      className="btn btn-primary c_margin1"
                      onClick={() => handleShowObservations(student.id)}
                    >
                      Ver Observaciones
                    </button>
                    <button
                      className="btn btn-primary c_margin1"
                      onClick={() => handleShowAttendance(student.id)}
                    >
                      Ver Asistencia
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            lastPage={gradeStudent ? gradeStudent?.pagination.totalPages : 0}
            maxLength={itemsPerPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
      {show && (
        <ModalStudentGrade
          gradeStudent={gradeStudent}
          handleClose={handleClose}
          fetchData={fetchData}
        ></ModalStudentGrade>
      )}
      {showGrades && selectedStudentId && (
        <ModalNotes
          show={showGrades}
          handleClose={handleCloseGrades}
          studentId={selectedStudentId}
        />
      )}
      {showObservations && selectedStudentId && (
        <ModalObservations
          show={showObservations}
          handleClose={handleCloseObservations}
          studentId={selectedStudentId}
        />
      )}
      {showAttendance && selectedStudentId && (
        <ModalAbsence
          show={showAttendance}
          handleClose={handleCloseAttendance}
          studentId={selectedStudentId}
        />
      )}
    </div>
  );
};

export default StudentsGrade;
