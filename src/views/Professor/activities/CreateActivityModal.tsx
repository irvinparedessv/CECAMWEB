import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Activity, ActivitySave } from "../../../types/Plans";
import PlanService from "../../../services/PlanService";
import { GradeService } from "../../../services";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";

import "react-datepicker/dist/react-datepicker.css";

interface Props {
  show: boolean;
  handleClose: () => void;
  subjectId: number | null;
  gradeId: number | null;
}

const AddActivityModal: React.FC<Props> = ({
  show,
  handleClose,
  subjectId,
  gradeId,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [periods, setPeriods] = useState<any[]>([]); // Tipo para periodos
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [newActivity, setNewActivity] = useState<ActivitySave>({
    description: "",
    typeId: "",
    percentage: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activitiesResponse = await PlanService.getActivities();
        const periodsResponse = await PlanService.getPeriods(); // Método para obtener periodos

        setActivities(activitiesResponse);
        setPeriods(periodsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const resetForm = () => {
    setNewActivity({
      description: "",
      typeId: "",
      percentage: 0,
    });
    setSelectedDate(null);
  };

  const handleAddActivity = async () => {
    if (
      !newActivity.typeId ||
      !newActivity.description ||
      !newActivity.percentage ||
      !newActivity.periodId ||
      !selectedDate
    ) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const data = {
      professorId: localStorage.getItem("userId"),
      subjectId: subjectId,
      gradeId: gradeId,
      dueDate: selectedDate,
      activity: newActivity,
    };
    console.log(data);
    try {
      const response = await GradeService.addActivity(data);
      handleClose();
      toast.success("Actividad enviada exitosamente!");
      resetForm();
    } catch (err) {
      toast.error("Error al enviar recordatorios de la actividad");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Actividad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formtype">
            <Form.Label>Tipo de Actividad:</Form.Label>
            <Form.Select
              onChange={(e) =>
                setNewActivity({
                  ...newActivity,
                  typeId: e.target.value,
                })
              }
            >
              <option value={""}>Selecciona el Tipo</option>
              {activities.map((activity, index) => (
                <option key={index} value={activity.typeId}>
                  {activity.typeName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {newActivity.typeId ? (
            <Form.Group controlId="formPeriodo">
              <Form.Label>Periodo:</Form.Label>
              <Form.Select
                onChange={(e) =>
                  setNewActivity({
                    ...newActivity,
                    periodId: e.target.value, // Asumiendo que periodoId es el campo correcto en newActivity
                  })
                }
              >
                <option value={""}>Selecciona el Periodo</option>
                {periods.map((period, index) => (
                  <option key={index} value={period.periodId}>
                    {period.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          ) : null}
          {newActivity.periodId ? (
            <>
              <Form.Group controlId="formActividad">
                <Form.Label>Nombre:</Form.Label>
                <Form.Control
                  type="text"
                  value={newActivity.description}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formPorcentaje">
                <Form.Label>Porcentaje:</Form.Label>
                <Form.Control
                  type="number"
                  value={newActivity.percentage}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      percentage: Number(e.target.value),
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formFecha">
                <Form.Label>Fecha de la Actividad:</Form.Label>
                <br />
                <DatePicker
                  className="form-select"
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                />
              </Form.Group>
            </>
          ) : null}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleAddActivity}>
          Agregar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddActivityModal;
