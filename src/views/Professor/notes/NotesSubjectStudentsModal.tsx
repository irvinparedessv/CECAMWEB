import React, { useState } from "react";
import { Modal, Table, Pagination, Form, Button } from "react-bootstrap";
import {
  Activity,
  Note,
  NotesStudents,
  Student,
  StudentGrade,
} from "../../../types/Notes";
import { removeAccents } from "../../../utils/text";
import { itemsPerPage } from "../../../const/Pagination";

interface Props {
  notes: NotesStudents[];
  show: boolean;
  handleClose: () => void;
}

const NotesModal: React.FC<Props> = ({ notes, show, handleClose }) => {
  // Calcula la lista de estudiantes únicos
  const students: StudentGrade[] = notes?.reduce(
    (acc: StudentGrade[], item: NotesStudents) => {
      item.notes.forEach((noteStudent) => {
        if (
          !acc.find(
            (studentGrade) =>
              studentGrade.student.id === noteStudent.student.student.id
          )
        ) {
          acc.push(noteStudent.student);
        }
      });
      return acc;
    },
    []
  );

  // Estados para la búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar estudiantes por término de búsqueda
  const filteredStudents = students.filter((student) =>
    removeAccents(`${student.student.firstName} ${student.student.lastName}`)
      .toLowerCase()
      .includes(removeAccents(searchTerm.toLowerCase()))
  );

  // Calcular índices para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Manejar el cambio de página
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  if (notes.length === 0) {
    return (
      <Modal size="xl" show={show} onHide={handleClose}>
        <Modal.Body>
          <p>No hay estudiantes en el grado</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Notas por Actividad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="search">
          <Form.Label>Buscar Estudiante</Form.Label>
          <Form.Control
            type="text"
            className="c_MarginBottom"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <Table bordered striped hover>
          <thead>
            <tr>
              <th>Estudiante</th>
              {notes.map((item) => (
                <th key={item.activity.activityId}>
                  {item.activity.description}
                </th>
              ))}
              <th>Nota Final</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  {student.student.firstName} {student.student.lastName}
                </td>
                {notes.map((item) => {
                  const note = item.notes.find(
                    (note) => note.student.student.id === student.student.id
                  );
                  return (
                    <td key={`${student.id}-${item.activity.activityId}`}>
                      {note && note.note ? note.note.note : "-"}
                    </td>
                  );
                })}
                <td>
                  {notes
                    .reduce((total, item) => {
                      const note = item.notes.find(
                        (note) => note.student.student.id === student.student.id
                      );
                      return (
                        total +
                        Number(note && note.note ? note.note.notePeriod : 0)
                      );
                    }, 0)
                    .toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={handleClose}>
          Cerrar
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotesModal;
