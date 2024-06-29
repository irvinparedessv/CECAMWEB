import React, { useState } from "react";
import { Modal, Button, Accordion, Card } from "react-bootstrap";
import StudentNotesModal from "./StudentNotesModal";

const ActivitiesModal = ({ show, handleClose, setShowModal, activities }) => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false); // State para controlar la visibilidad del modal de notas
  const handleOpenNotesModal = (activity) => {
    setSelectedActivity(activity);

    setShowNotesModal(true);
    setShowModal(false); // Mostrar el modal de notas cuando se selecciona una actividad
  };

  const handleCloseNotesModal = () => {
    setSelectedActivity(null);
    setShowNotesModal(false); // Ocultar el modal de notas al cerrarlo
    setShowModal(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Actividades</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion>
            {Object.keys(activities).map((name) => (
              <Card key={name}>
                <Accordion.Item eventKey={name}>
                  <Accordion.Header as={Card.Header}>{name}</Accordion.Header>
                  <Accordion.Body>
                    <Card.Body>
                      {activities[name].map((activity) => (
                        <div key={activity.activityId}>
                          <p>
                            {activity.description} - {activity.percentage}% /{" "}
                            Fecha: {activity.dueDate}
                          </p>
                          <Button
                            variant="primary"
                            onClick={() => handleOpenNotesModal(activity)}
                          >
                            Ver Notas Actividad
                          </Button>{" "}
                        </div>
                      ))}
                    </Card.Body>
                  </Accordion.Body>
                </Accordion.Item>
              </Card>
            ))}
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Notas */}
      {selectedActivity && (
        <StudentNotesModal
          show={showNotesModal} // Mostrar modal de notas según el estado
          handleClose={handleCloseNotesModal} // Función para cerrar el modal de notas
          activity={selectedActivity} // Pasar la actividad seleccionada al modal de notas
        />
      )}
    </>
  );
};

export default ActivitiesModal;
