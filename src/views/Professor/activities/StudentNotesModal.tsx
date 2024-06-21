import React, { useState } from "react";
import { Modal, Button, Table, Form, Pagination } from "react-bootstrap";
import ProfessorService from "../../../services/ProfessorService";
import { Student } from "../../../types/Student";
import { itemsPerPage } from "../../../const/Pagination";

interface ActivityStudent {
  id: number;
  activityId: number;
  studentId: number;
  note: string;
  notePercentage: string;
  notePeriod: string;
  dateInsert: string;
  created_at: string;
  updated_at: string;
  student: Student;
}

interface StudentNotesModalProps {
  show: boolean;
  handleClose: () => void;
  activity: any;
}

const StudentNotesModal: React.FC<StudentNotesModalProps> = ({
  show,
  handleClose,
  activity,
}) => {
  const [studentsAct, setStudentsAct] = useState<ActivityStudent[]>([]);
  const [editedNotes, setEditedNotes] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    const fetchStudentsNotes = async () => {
      const response = await ProfessorService.studentsNoteByActivities(
        activity.activityId
      );
      setStudentsAct(response);
    };
    if (activity) {
      fetchStudentsNotes();
    }
  }, [activity]);

  const handleNoteChange = (studentId, note) => {
    setEditedNotes((prev) => ({
      ...prev,
      [studentId]: note,
    }));
  };

  const handleSaveNotes = async () => {
    try {
      const updatePromises = studentsAct.map((student) => {
        const newNote = editedNotes[student.studentId];
        if (newNote !== undefined) {
          return ProfessorService.updateStudentNote(
            student.activityId,
            student.studentId,
            { note: newNote }
          );
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      handleClose();
      // Optionally refresh the notes or the activities list if needed
    } catch (error) {
      console.error("Error al guardar las notas:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const filteredStudents = studentsAct.filter((stud) =>
    removeAccents(`${stud.student.firstName} ${stud.student.lastName}`)
      .toLowerCase()
      .includes(removeAccents(searchTerm.toLowerCase()))
  );

  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const paginatedStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <Modal size="xl" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Notas de Actividad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          className="c_MarginBottom"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre y Apellido</th>
              <th>Nota</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((stud) => (
              <tr key={stud.studentId}>
                <td>
                  {stud.student.firstName} {stud.student.lastName}
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={
                      editedNotes[stud.studentId] ||
                      editedNotes[stud.studentId] === ""
                        ? editedNotes[stud.studentId]
                        : stud.note
                    }
                    onChange={(e) =>
                      handleNoteChange(stud.studentId, e.target.value)
                    }
                  />
                </td>
                <td>
                  <Button variant="primary" onClick={handleSaveNotes}>
                    Guardar
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentNotesModal;
