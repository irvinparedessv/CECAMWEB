// src/components/ActivitiesModal.js
import React, { useState } from "react";
import { Modal, Button, Accordion, Card, Table, Form } from "react-bootstrap";

const ActivitiesModal = ({ show, handleClose, activities }) => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState(null);

  const handleOpenNotesModal = (activity) => {
    setSelectedActivity(activity);
    setEditMode(false); // Al abrir el modal, desactivamos el modo de edición
  };

  const handleOpenEditModal = (activity) => {
    setSelectedActivity(activity);
    //setEditMode(true); // Al abrir el modal, activamos el modo de edición
    setEditedNote(activity.note); // Cargar la nota actual del usuario en el estado
  };

  const handleSaveNote = async () => {
    try {
      // Aquí puedes implementar la lógica para guardar la nota editada
      // Por ejemplo, enviar una solicitud PUT al backend
      console.log("Nota guardada:", editedNote);
      // Aquí podrías implementar la lógica para guardar la nota modificada en el backend
      // axios.put(`/api/activities/${selectedActivity.activityId}/students/${selectedActivity.studentId}`, { note: editedNote });
      // Luego de guardar, puedes cerrar el modal
      setEditMode(false);
    } catch (error) {
      console.error("Error al guardar la nota:", error);
    }
  };

  return (
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
                        <Button
                          variant="secondary"
                          onClick={() => handleOpenEditModal(activity)}
                        >
                          Editar Nota
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
          Close
        </Button>
      </Modal.Footer>

      {/* Modal para mostrar y editar las notas */}
      {selectedActivity && (
        <Modal
          show={selectedActivity !== null}
          onHide={() => setSelectedActivity(null)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Notas de Actividad</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nombre y Apellido</th>
                  <th>Nota</th>
                  {editMode && <th>Editar</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {selectedActivity.student.name}{" "}
                    {selectedActivity.student.lastname}
                  </td>
                  <td>{selectedActivity.note}</td>
                  {editMode && (
                    <td>
                      <Form.Control
                        type="number"
                        value={editedNote}
                        onChange={(e) => setEditedNote(e.target.value)}
                      />
                    </td>
                  )}
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            {editMode && (
              <Button variant="primary" onClick={handleSaveNote}>
                Guardar
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => setSelectedActivity(null)}
            >
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Modal>
  );
};

export default ActivitiesModal;
