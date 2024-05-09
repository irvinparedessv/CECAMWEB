import React, { useEffect, useState } from "react";
import { Modal, Spinner, FormCheck } from "react-bootstrap";
import toast from "react-hot-toast";
import StudentService from "../../services/StudentService";
import { GradeStudents, Student } from "../../types";
import { Pagination } from "../../components/Pagination";
import { itemsPerPage } from "../../const/Pagination";
import { PaginationType } from "../../types/Paginations";
import "./style.css";

interface Props {
  handleClose: () => void;
  fetchData: () => void;
  gradeStudent: GradeStudents | undefined;
}

const ModalStudentGrade: React.FC<Props> = ({
  handleClose,
  fetchData,
  gradeStudent,
}) => {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<PaginationType>();

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    if (initialLoadComplete) {
      // Efecto para la búsqueda
      const delayDebounceFn = setTimeout(() => {
        console.log(searchTerm);
        fetchStudents();
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setInitialLoadComplete(true);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Efecto para la paginación

    fetchStudents();
  }, [currentPage]);

  useEffect(() => {
    // Carga inicial de datos
    if (!initialLoadComplete) {
      fetchStudents();
      setInitialLoadComplete(true);
    }
  }, []);
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await StudentService.getAll(currentPage, searchTerm);
      setIsLoading(false);
      if (response.success) {
        console.log(response);
        setPagination(response.pagination);
        setAllStudents(response.data);
      } else {
        setError("Failed to fetch grades");
      }
    } catch (error) {
      setError("Failed to fetch grades");
      setIsLoading(false);
    }
  };

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
            fetchStudents();
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
    <Modal show={true} onHide={handleClose} size="lg">
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
        </div>
        {isLoading ? (
          <div className="text-center divtableloading">
            <Spinner animation="border" />
          </div>
        ) : (
          <table className="table divtableloading">
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
                      className="formchecksubs"
                      name={`subscription_${student.id}`}
                      defaultChecked={
                        Number(student.gradeId) === gradeStudent?.grade.gradeId
                      }
                      onClick={() =>
                        handleSubscriptionChange(
                          Number(student.id),
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
        <Pagination
          currentPage={currentPage}
          lastPage={pagination ? pagination.totalPages : 0}
          maxLength={itemsPerPage}
          setCurrentPage={setCurrentPage}
        />
        {error && <p>{error}</p>}
      </Modal.Body>
    </Modal>
  );
};

export default ModalStudentGrade;
