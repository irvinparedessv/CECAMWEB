import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Table, Pagination } from "react-bootstrap";
import Swal from "sweetalert2";
import SubjectService from "../../services/SubjectService";
import { Subject } from "../../types"; // Importa la interfaz Subject
import { itemsPerPage } from "../../const/Pagination";

const SubjectForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [code, setCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para el término de búsqueda
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSubjects = async () => {
    try {
      const params = {
        page: currentPage,
        size: itemsPerPage,
        filter: searchTerm,
      };
      const response = await SubjectService.getAllSubjectsFilter(params);
      setSubjects(response.data);
      setTotalPages(response.last_page);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setErrorMessage(
        "Error al cargar las materias. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, searchTerm]);

  const handleEdit = (subject: Subject) => {
    setSubjectId(subject.subjectId);
    setSubjectName(subject.subjectName);
    setCode(subject.code);
    setShowModal(true);
  };
  const handlePageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (subjectId !== null) {
        await SubjectService.updateSubject(subjectId, subjectName, code);
        Swal.fire(
          "Actualizado",
          "Materia actualizada correctamente.",
          "success"
        );
      } else {
        await SubjectService.createSubject(subjectName, code);
        Swal.fire("Guardado", "Materia creada correctamente.", "success");
      }
      fetchSubjects();
      setShowModal(false);
      setSubjectId(null);
      setSubjectName("");
      setCode("");
    } catch (error) {
      console.error("Error creando/actualizando materia:", error);
      setErrorMessage(
        "Error al crear/actualizar la materia. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };

  const handleDelete = async (subjectId: number) => {
    try {
      await SubjectService.deleteSubject(subjectId);
      fetchSubjects();
      Swal.fire("Eliminado", "Materia eliminada correctamente.", "success");
    } catch (error) {
      console.error("Error eliminando materia:", error);
      setErrorMessage(
        "Error al eliminar la materia. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };

  const confirmDelete = (subjectId: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(subjectId);
      }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre o código"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ width: "300px" }} // Ajusta el tamaño del campo de búsqueda
        />
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Registrar Materia
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {subjectId !== null ? "Editar Materia" : "Registrar Materia"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formSubjectName">
              <Form.Label>Nombre de la Materia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre de la Materia"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCode">
              <Form.Label>Código de la Materia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Código de la Materia"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {subjectId !== null ? "Actualizar" : "Guardar"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre de la Materia</th>
            <th>Código de la Materia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.subjectId}>
              <td>{subject.subjectName}</td>
              <td>{subject.code}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(subject)}>
                  Editar
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => confirmDelete(subject.subjectId)}
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
            onClick={() => handlePageChange(pageIndex + 1)}
          >
            {pageIndex + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default SubjectForm;
