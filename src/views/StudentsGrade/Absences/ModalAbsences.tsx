import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Calendar from "react-calendar";
import { format } from "date-fns";

import "react-calendar/dist/Calendar.css";
import "./ModalAttendance.css";

import StudentService from "../../../services/StudentService";
import { Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";

interface ModalAttendanceProps {
  show: boolean;
  handleClose: () => void;
  studentId: number;
}

interface Absence {
  date: string;
  hasPermission: boolean;
}

const ModalAttendance: React.FC<ModalAttendanceProps> = ({
  show,
  handleClose,
  studentId,
}) => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        const response = await StudentService.getAbsencesByStudentId(studentId);
        setAbsences(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (studentId && show) {
      fetchAbsences();
    }
  }, [studentId, show]);

  const normalizeDate = (date: Date) => {
    const isoString = date.toISOString();
    return isoString.split("T")[0]; // returns only the date part (YYYY-MM-DD)
  };

  const getTileClassName = ({ date, view }: any) => {
    if (view === "month") {
      const normalizedDate = normalizeDate(date);
      const absence = absences.find(
        (abs) => normalizeDate(new Date(abs.date)) === normalizedDate
      );
      if (absence) {
        return absence.hasPermission ? "absence-permission" : "absence";
      }
    }
    return null;
  };

  const tileDisabled = ({ date, view }: any) => {
    if (view === "month") {
      const day = date.getDay();
      return day === 0 || day === 6; // Disable weekends (Sunday = 0, Saturday = 6)
    }
    return false;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasPermission(e.target.checked);
  };

  const handleSaveAbsence = async () => {
    if (selectedDate) {
      try {
        const professorId = localStorage.getItem("userId");
        await StudentService.addAbsence(studentId, {
          comment: comment,
          professorId: professorId,
          date: selectedDate,
          hasPermission: hasPermission,
        });
        const response = await StudentService.getAbsencesByStudentId(studentId);
        setAbsences(response.data);
        setSelectedDate(null);
        setHasPermission(false);
        toast.success("AUSENCIA AGREDADA");
      } catch (error) {
        console.error("Error saving absence:", error);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Asistencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="total-absences">
          <strong>Total de inasistencias: {absences.length}</strong>
        </div>
        <div className="color-indications">
          <div>
            <span className="color-box absence"></span> Inasistencia
          </div>
          <div>
            <span className="color-box absence-permission"></span> Inasistencia
            con permiso
          </div>
          <div>
            <span className="color-box current-day"></span> Día actual
          </div>
        </div>
        <Calendar
          tileClassName={getTileClassName}
          tileDisabled={tileDisabled}
          onClickDay={handleDateClick}
        />
        {selectedDate && (
          <div>
            <h5>
              Agregar inasistencia para:{" "}
              {format(new Date(selectedDate), "dd/MM/yyyy")}
            </h5>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={hasPermission}
                  onChange={handlePermissionChange}
                />
                Con permiso
              </label>
              <Form.Group>
                <Form.Control
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
              </Form.Group>
            </div>
            <Button onClick={handleSaveAbsence}>Guardar inasistencia</Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalAttendance;
