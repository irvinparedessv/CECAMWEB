// src/components/ModalAttendance.tsx

import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ModalAttendance.css"; // Asegúrate de importar el archivo CSS

import ModalAbsence from "./ModalAbsences";
import StudentService from "../../../services/StudentService";

interface ModalAttendanceProps {
  show: boolean;
  handleClose: () => void;
  studentId: number;
}

interface Absence {
  date: string;
  hasPermission: boolean;
}

const ModalAbsences: React.FC<ModalAttendanceProps> = ({
  show,
  handleClose,
  studentId,
}) => {
  const [absences, setAbsences] = useState<Absence[]>([]);

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

  const getTileClassName = ({ date, view }: any) => {
    if (view === "month") {
      const absence = absences.find(
        (abs) => new Date(abs.date).toDateString() === date.toDateString()
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
  const totalAbsences = absences.length;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Asistencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="total-absences">
          <strong>Total de inasistencias: {totalAbsences}</strong>
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
        />
      </Modal.Body>
    </Modal>
  );
};

export default ModalAbsences;
