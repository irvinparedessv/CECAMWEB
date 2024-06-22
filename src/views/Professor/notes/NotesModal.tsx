import React from "react";
import { Modal, Table } from "react-bootstrap";
import { Activity, Note, NotesStudents, Student } from "../../../types/Notes";

interface Props {
  notes: NotesStudents[];
  show: boolean;
  handleClose: () => void;
}

const NotesModal: React.FC<Props> = ({ notes, show, handleClose }) => {
  // Calcula la lista de estudiantes únicos
  const students: Student[] = notes.reduce(
    (acc: Student[], item: NotesStudents) => {
      item.notes.forEach((note) => {
        if (!acc.find((student) => student.id === note.student.id)) {
          acc.push(note.student);
        }
      });
      return acc;
    },
    []
  );

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Notas por Actividad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table bordered striped hover>
          <thead>
            <tr>
              <th>Estudiante</th>
              {notes.map((item) => (
                <th key={item.activity.activityId}>
                  {item.activity.description}
                </th>
              ))}
              <th>Nota Final</th> {/* Nueva columna para la nota final */}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  {student.firstName} {student.lastName}
                </td>
                {notes.map((item) => {
                  const note = item.notes.find(
                    (note) => note.student.id === student.id
                  );
                  return (
                    <td key={`${student.id}-${item.activity.activityId}`}>
                      {note ? note.note : "-"}
                    </td>
                  );
                })}
                <td>
                  {/* Calcular la suma de notePeriod para la nota final */}
                  {notes
                    .reduce((total, item) => {
                      const note = item.notes.find(
                        (note) => note.student.id === student.id
                      );
                      return total + Number(note ? note.notePeriod : 0);
                    }, 0)
                    .toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
