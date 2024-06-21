import React, { useState, useEffect } from "react";
import "./attendance.css";
import { toast } from "react-toastify";
import StudentService from "../../services/StudentService";
import { GradeService } from "../../services";
import { useParams } from "react-router-dom";
import { Grade } from "../../types";
import { Absence, StudentsAbsences } from "./../../types/Student";
import { Button, Form, Modal, Spinner } from "react-bootstrap";

interface RouteParams {
  id: string;
  [key: string]: string | undefined; // Añadir firma de índice
}

const Attendance: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [loading, setLoading] = useState(true);
  const [selectedAttendance, setSelectedAttendance] = useState<Absence | null>(
    null
  );

  const getMonthName = (month: number): string => {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return monthNames[month - 1];
  };

  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [students, setStudents] = useState<StudentsAbsences[]>([]);
  const [grade, setGrade] = useState<Grade>();
  const [comment, setComment] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await GradeService.getAbsences(Number(id));
      const data = response.data;
      setStudents(data.students);
      setGrade(data.grade);
      setLoading(false); // Marcar carga como completa
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setLoading(false); // En caso de error, también detenemos la carga
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const getDaysInMonth = (month: number, year: number): number[] => {
    const date: Date = new Date(year, month, 0);
    const daysInMonth: number = date.getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentsAbsences | null>(null);

  const [showModal, setShowModal] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPermissionChecked(e.target.checked);
  };

  const [permissionChecked, setPermissionChecked] = useState(false);

  const handleOpenModal = (day: number, student: StudentsAbsences) => {
    const selectedDate = new Date(currentYear, currentMonth - 1, day);
    setSelectedDate(selectedDate);

    // Encuentra la falta o permiso correspondiente para el día seleccionado
    const selected = student.absences.find(
      (absence) => absence.date === formatDate(selectedDate)
    );
    if (selected) {
      // Establece el attendance seleccionado para edición
      setSelectedAttendance(selected || null);
      setComment(selected.comment);
      setPermissionChecked(selected.hasPermission);
    }
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setPermissionChecked(false); // Reiniciar el estado del checkbox
  };

  const handleSubmitAbsence = async () => {
    if (selectedDate && selectedStudent) {
      try {
        let response;
        if (selectedAttendance) {
          // Si hay una falta/permiso seleccionado, actualiza en lugar de agregar
          response = await StudentService.updateAbsence(
            Number(selectedStudent.id),
            Number(selectedAttendance.id), // Asegúrate de tener un ID para la falta o permiso
            {
              professorId: localStorage.getItem("userId"),
              date: selectedDate,
              comment: comment,
              hasPermission: permissionChecked,
            }
          );
          setSelectedAttendance(null);
          setComment("");
          setPermissionChecked(false);
        } else {
          // De lo contrario, agrega como una nueva falta/permiso
          response = await StudentService.addAbsence(
            Number(selectedStudent.id),
            {
              professorId: localStorage.getItem("userId"),
              date: selectedDate,
              comment: comment,
              hasPermission: permissionChecked,
            }
          );
          setSelectedAttendance(null);
          setComment("");
          setPermissionChecked(false);
        }

        handleCloseModal();
        toast.success("Inasistencia agregada o actualizada correctamente");
        fetchData(); // Recargar datos después de agregar o actualizar la inasistencia
      } catch (error) {
        console.error("Error al agregar o actualizar la inasistencia:", error);
        toast.error("Error al agregar o actualizar la inasistencia");
      }
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const totalAbsences = students.reduce(
    (totals, student) => {
      student.absences.forEach((absence) => {
        const absenceDate = parseDate(absence.date);
        if (
          absenceDate.getFullYear() === currentYear &&
          absenceDate.getMonth() + 1 === currentMonth
        ) {
          if (absence.hasPermission) {
            totals.withPermission++;
          } else {
            totals.withoutPermission++;
          }
        }
      });
      return totals;
    },
    { withPermission: 0, withoutPermission: 0 }
  );

  const isWeekend = (day: number): boolean => {
    const date = new Date(currentYear, currentMonth - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday (0) or Saturday (6)
  };

  return loading ? (
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
      style={{ marginRight: "5px" }}
    />
  ) : (
    <div>
      <h3>
        Asistencia {grade?.name} {grade?.section}
      </h3>
      <h4>{`Mes: ${getMonthName(currentMonth)} / Año: ${currentYear}`}</h4>
      <button onClick={handlePreviousMonth} className="btn btn-primary">
        &#60; Mes Anterior
      </button>
      <button onClick={handleNextMonth} className="btn btn-primary">
        Mes Siguiente &#62;
      </button>

      <div>
        <p>Total de faltas (sin permiso): {totalAbsences.withoutPermission}</p>
        <p>Total de faltas (con permiso): {totalAbsences.withPermission}</p>
      </div>

      <div className="asistencia-container">
        <div className="dias-header">
          <div className="nombre-header"></div>
          {getDaysInMonth(currentMonth, currentYear).map((day) => (
            <div key={day} className="dia-header">
              {day}
            </div>
          ))}
        </div>
        {students.map((student, studentIndex) => (
          <div key={studentIndex} className="student-row">
            <div className="nombre">
              {student.firstName} {student.lastName}
            </div>
            <div className="dias-row">
              {getDaysInMonth(currentMonth, currentYear).map((day) => {
                const currentDate = new Date(
                  currentYear,
                  currentMonth - 1,
                  day
                );
                return (
                  <div
                    key={day}
                    className={`dia ${isWeekend(day) ? "fin-de-semana" : ""} ${
                      student.absences.some(
                        (absence) =>
                          absence.date === formatDate(currentDate) &&
                          absence.hasPermission
                      )
                        ? "permiso"
                        : ""
                    }
                        
                    ${
                      student.absences.some(
                        (absence) =>
                          absence.date === formatDate(currentDate) &&
                          !absence.hasPermission
                      )
                        ? "falta"
                        : ""
                    }
                        `}
                    onClick={() =>
                      !isWeekend(day) && handleOpenModal(day, student)
                    }
                  >
                    {student.absences.some(
                      (absence) => absence.date === formatDate(currentDate)
                    )
                      ? "X"
                      : "-"}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedAttendance ? "Editar" : "Confirmar"} Inasistencia
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Fecha seleccionada: {selectedDate?.toLocaleDateString()}</p>
            <Form.Group>
              <Form.Control
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
              <Form.Check
                type="checkbox"
                id="permissionCheckbox"
                label="Con permiso"
                checked={permissionChecked}
                onChange={handleCheckboxChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handleSubmitAbsence}>
              {selectedAttendance ? "Actualizar" : "Agregar"} Inasistencia
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Attendance;
