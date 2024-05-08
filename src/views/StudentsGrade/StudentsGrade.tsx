import React, { useEffect, useState } from "react";
import { GradeStudents } from "../../types";
import { GradeService } from "../../services";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "react-bootstrap/Modal";
import { Button, Spinner, FormCheck } from "react-bootstrap";
import { Student } from "../../types/Student";
import StudentService from "../../services/StudentService";

interface RouteParams {
  id: string;
  [key: string]: string | undefined; // Añadir firma de índice
}

const StudentsGrade = () => {
  const { id } = useParams<RouteParams>();
  const [gradeStudent, setGradeStudent] = useState<GradeStudents>();
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string>("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleModalOpen = async () => {
    handleShow();
    await fetchStudents(currentPage, searchTerm);
  };

  const fetchStudents = async (page: number, search: string) => {
    try {
      setLoading(true);
      const response = await StudentService.getAll(page, search);
      setLoading(false);
      if (response.success) {
        console.log(response.data);
        setAllStudents(response.data);
      } else {
        setError("Failed to fetch grades");
      }
    } catch (error) {
      setError("Failed to fetch grades");
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await GradeService.getStudents(Number(id));
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
  }, []);

  const handleSubscriptionChange = async (
    studentId: number,
    gradeId: number
  ) => {
    try {
      setIsLoading(true);
      toast.promise(
        StudentService.enroll(studentId, gradeId).then((response) => {
          if (response.success) {
            setIsLoading(false);
            fetchData();
            fetchStudents(currentPage, searchTerm);
            toast.success(response.message);
          }
        }),
        {
          loading: "Cambiando...",
          success: "Cambio realizado correctamente!",
          error: <b>Error al cambiar estado.</b>,
        }
      );
    } catch (error) {
      console.error("Error al cambiar estado de suscripción:", error);
    }
  };

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
          {gradeStudent?.student.map((student) => (
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
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Estudiantes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar estudiantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={() => fetchStudents(currentPage, searchTerm)}>
              Buscar
            </Button>
          </div>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Inscrito</th>
                </tr>
              </thead>
              <tbody>
                {allStudents.map((student) => (
                  <tr key={student.id + "student"}>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>
                      <FormCheck
                        type="radio"
                        disabled={isLoading}
                        name={`subscription_${student.id}`}
                        defaultChecked={
                          student.gradeId == gradeStudent?.grade.gradeId
                        }
                        onClick={() =>
                          handleSubscriptionChange(
                            student.id,
                            Number(gradeStudent?.grade.gradeId)
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentsGrade;
