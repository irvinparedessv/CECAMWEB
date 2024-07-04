import React, { useState, useEffect } from "react";
import { Table, Button, Form, Pagination, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GradeSubjectService from "./../../services/GradeSubjectService";
import { itemsPerPage } from "../../const/Pagination";
import toast from "react-hot-toast";

interface GradeSubject {
  grade: any;
  subject: any;
  plan: any;
  professor: any;
  gradeSubjectId: number;
  gradeName: string;
  planName: string;
  subjectName: string;
  firstName: string;
  lastName: string;
}

const GradeSubjectList: React.FC = () => {
  const navigate = useNavigate();

  const [gradeSubjects, setGradeSubjects] = useState<GradeSubject[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchGradeSubjects();
  }, [currentPage, searchTerm]);

  const fetchGradeSubjects = async () => {
    setLoading(true);
    try {
      const response = await GradeSubjectService.getGradesSubjects(
        currentPage,
        searchTerm
      );
      setTotalPages(response.last_page);
      setGradeSubjects(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reiniciar a la primera página al cambiar el término de búsqueda
  };
  const handleDeleteClick = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      setLoading(true);
      try {
        await GradeSubjectService.deleteGradeSubject(id);
        setGradeSubjects(
          gradeSubjects.filter((gs) => gs.gradeSubjectId !== id)
        );
        toast.success("Registro eliminado exitosamente");
      } catch (error) {
        console.error(error);
        toast.error(
          "Ocurrió un error al eliminar el registro. Por favor intente nuevamente."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEditClick = (gradeSubject: GradeSubject) => {
    navigate("/subject-grade-edit", { state: { gradeSubject } });
  };

  return (
    <div>
      <Form className="mb-3">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre de materia"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Form.Group>
      </Form>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Grado</th>
                <th>Nombre de la Materia</th>
                <th>Nombre del Profesor</th>
                <th>Apellido del Profesor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gradeSubjects.map((gradeSubject, index) => (
                <tr key={gradeSubject.gradeSubjectId}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    {gradeSubject.grade.name}-{gradeSubject.grade.section}
                  </td>
                  <td>{gradeSubject.subject.subjectName}</td>
                  <td>{gradeSubject.professor?.firstName}</td>
                  <td>{gradeSubject.professor?.lastName}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEditClick(gradeSubject)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleDeleteClick(gradeSubject.gradeSubjectId)
                      }
                      className="ml-2"
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            {[...Array(totalPages)].map((_, pageIndex) => (
              <Pagination.Item
                key={pageIndex + 1}
                active={pageIndex + 1 === currentPage}
                onClick={() => paginate(pageIndex + 1)}
              >
                {pageIndex + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </div>
  );
};

export default GradeSubjectList;
