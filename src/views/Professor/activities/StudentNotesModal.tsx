import React, { useState } from "react";
import {
  Modal,
  Button,
  Table,
  Form,
  Pagination,
  Spinner,
} from "react-bootstrap";
import ProfessorService from "../../../services/ProfessorService";
import { Student } from "../../../types/Student";
import { itemsPerPage } from "../../../const/Pagination";
import { removeAccents } from "../../../utils/text";
import toast from "react-hot-toast";

interface ActivityStudent {
  student: Student;
  activityStudent: {
    id: number;
    activityId: number;
    studentId: number;
    note: string;
    notePercentage: string;
    notePeriod: string;
    dateInsert: string;
    created_at: string;
    updated_at: string;
  };
}

interface StudentNotesModalProps {
  show: boolean;
  handleClose: () => void;
  activity: any;
  gradeId: string;
}

const StudentNotesModal: React.FC<StudentNotesModalProps> = ({
  show,
  gradeId,
  handleClose,
  activity,
}) => {
  const [studentsAct, setStudentsAct] = useState<ActivityStudent[]>([]);
  const [editedNotes, setEditedNotes] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchStudentsNotes = async () => {
      setLoading(true);
      try {
        const response = await ProfessorService.studentsNoteByActivities(
          activity.activityId,
          gradeId
        );
        setStudentsAct(response);
      } catch (error) {
        console.error("Error al obtener las notas de los estudiantes:", error);
      } finally {
        setLoading(false);
      }
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

  const handleSaveNotes = async (id) => {
    try {
      const updatePromises = studentsAct
        .filter((o) => o.student.id == id)
        .map((student) => {
          if (student.activityStudent) {
            const newNote = editedNotes[student.student.id];
            if (newNote !== undefined && newNote >= 0 && newNote <= 10) {
              return ProfessorService.updateStudentNote(
                student.activityStudent.activityId,
                student.activityStudent.studentId,
                { note: newNote }
              );
            } else {
              toast.error("DEBE SER UNA NOTA VÁLIDA");
              return Promise.reject("Nota inválida");
            }
          } else {
            const newNote = editedNotes[student.student.id];
            if (newNote !== undefined && newNote >= 0 && newNote <= 10) {
              return ProfessorService.updateStudentNote(
                activity.activityId,
                student.student.id,
                { note: newNote }
              );
            } else {
              toast.error("DEBE SER UNA NOTA VÁLIDA");
              return Promise.reject("Nota inválida");
            }
          }
        });

      await Promise.all(updatePromises);
      toast.success("NOTA INGRESADA CORRECTAMENTE");

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

  if (isLoading) {
    return (
      <Modal size="xl" show={show} onHide={handleClose}>
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Cargando...</span>
          </Spinner>
        </Modal.Body>
      </Modal>
    );
  }

  if (studentsAct.length === 0) {
    return (
      <Modal size="xl" show={show} onHide={handleClose}>
        <Modal.Body>
          <p>No existen notas para esta actividad.</p>
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
              <tr key={stud.student.id}>
                <td>
                  {stud.student.firstName} {stud.student.lastName}
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={
                      editedNotes[stud.student.id] ||
                      editedNotes[stud.student.id] === ""
                        ? editedNotes[stud.student.id]
                        : stud.activityStudent?.note || 0
                    }
                    onChange={(e) =>
                      handleNoteChange(stud.student.id, e.target.value)
                    }
                  />
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleSaveNotes(stud.student.id)}
                  >
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
