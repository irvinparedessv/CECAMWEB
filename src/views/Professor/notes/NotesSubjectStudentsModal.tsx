import React, { useState } from "react";
import {
  Modal,
  Table,
  Pagination,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import {
  Activity,
  Note,
  NotesStudents,
  Student,
  StudentGrade,
} from "../../../types/Notes";
import { removeAccents } from "../../../utils/text";
import { itemsPerPage } from "../../../const/Pagination";
import ProfessorService from "./../../../services/ProfessorService";
import toast from "react-hot-toast";

interface Props {
  notes: NotesStudents[];
  refreshNote: () => void;
  show: boolean;
  handleClose: () => void;
}

const NotesModal: React.FC<Props> = ({
  notes,
  show,
  refreshNote,
  handleClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<{
    studentId: number;
    activityId: number;
    initialNote: string;
  } | null>(null);

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

  const filteredStudents = students.filter((student) =>
    removeAccents(`${student.student.firstName} ${student.student.lastName}`)
      .toLowerCase()
      .includes(removeAccents(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleNoteEdit = (
    studentId: number,
    activityId: number,
    initialNote: string
  ) => {
    setEditingNote({ studentId, activityId, initialNote });
  };

  const handleNoteSave = async () => {
    if (
      editingNote.initialNote !== "" &&
      !isNaN(parseFloat(editingNote.initialNote)) &&
      parseFloat(editingNote.initialNote) >= 0 &&
      parseFloat(editingNote.initialNote) <= 10
    ) {
      setLoading(true);

      // Aquí deberías llamar a tu servicio para guardar la nota
      // Ejemplo ficticio de cómo sería:
      const response = await ProfessorService.updateStudentNote(
        editingNote.activityId,
        editingNote.studentId,
        {
          note: editingNote.initialNote,
        }
      );
      await refreshNote();
      toast.success("NOTA ACTUALIZADA CORRECTAMENTE");
      setLoading(false);

      setEditingNote(null); // Finaliza la edición
    } else {
      toast.error("La nota debe ser un número entre 0 y 10.");
    }
  };

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
    <Modal show={show} onHide={handleClose} size="xl" className="c_ModalNotes">
      <Modal.Header closeButton>
        <Modal.Title>Notas por Actividad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Spinner />
        ) : (
          <>
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
                      if (
                        editingNote?.studentId === student.student.id &&
                        editingNote?.activityId === item.activity.activityId
                      ) {
                        return (
                          <td key={`${student.id}-${item.activity.activityId}`}>
                            <Form.Control
                              type="text"
                              defaultValue={note?.note?.note || ""}
                              onChange={(e) => {
                                const newNote = e.target.value;
                                setEditingNote({
                                  studentId: student.student.id,
                                  activityId: item.activity.activityId,
                                  initialNote: newNote || "",
                                });
                              }}
                            />
                            <Button
                              variant="primary"
                              onClick={() => handleNoteSave()}
                            >
                              Guardar
                            </Button>
                          </td>
                        );
                      } else {
                        return (
                          <td key={`${student.id}-${item.activity.activityId}`}>
                            <button
                              className="btn btn-link"
                              onClick={() =>
                                handleNoteEdit(
                                  student.student.id,
                                  item.activity.activityId,
                                  note?.note?.note || ""
                                )
                              }
                            >
                              {note && note.note ? note.note.note : "-"}
                            </button>
                          </td>
                        );
                      }
                    })}
                    <td>
                      {notes
                        .reduce((total, item) => {
                          const note = item.notes.find(
                            (note) =>
                              note.student.student.id === student.student.id
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
          </>
        )}
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
