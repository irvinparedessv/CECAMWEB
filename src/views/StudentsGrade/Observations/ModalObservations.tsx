import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, Form, Card } from "react-bootstrap";
import { format } from "date-fns";
import StudentService from "../../../services/StudentService";
import toast from "react-hot-toast";

const ModalObservations = ({ show, handleClose, studentId }) => {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newObservation, setNewObservation] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false); // State para controlar visibilidad del formulario

  useEffect(() => {
    if (show) {
      const fetchObservations = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await StudentService.getObservations(studentId);
          setObservations(response.data);
        } catch (error) {
          setError("Failed to fetch observations");
        } finally {
          setLoading(false);
        }
      };
      fetchObservations();
    }
  }, [show, studentId]);

  const handleAddObservation = async () => {
    if (!newObservation.trim()) {
      setAddError("La observación no puede estar vacía.");
      return;
    }

    setAdding(true);
    setAddError("");
    try {
      const id = await localStorage.getItem("userId");
      const response = await StudentService.addObservation(studentId, {
        professorId: id,
        description: newObservation,
      });
      setObservations([...observations, response.data]);
      setNewObservation("");
      setShowAddForm(false); // Oculta el formulario después de agregar
      toast.success("OBSERVACION ENVIADA CORRECTAMENTE");
    } catch (error) {
      setAddError("Failed to add observation");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Observaciones del Estudiante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div>
            {observations.length === 0 ? (
              <p>No existen observaciones para este estudiante.</p>
            ) : (
              observations.map((observation) => (
                <Card key={observation.observationId} className="mb-3">
                  <Card.Body>
                    <Card.Text>
                      <strong>
                        {format(new Date(observation.date), "dd/MM/yyyy")}
                      </strong>
                      : {observation.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))
            )}
            {!showAddForm && (
              <Button variant="primary" onClick={() => setShowAddForm(true)}>
                Añadir Observación
              </Button>
            )}
            {showAddForm && (
              <Form className="mt-3">
                <Form.Group controlId="formObservation">
                  <Form.Label>Nueva Observación</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="c_MarginBottom"
                    value={newObservation}
                    onChange={(e) => setNewObservation(e.target.value)}
                  />
                </Form.Group>
                {addError && <p className="text-danger">{addError}</p>}
                <Button
                  variant="primary"
                  onClick={handleAddObservation}
                  disabled={adding || !newObservation.trim()}
                >
                  {adding ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Agregar Observación"
                  )}
                </Button>
                <Button
                  variant="secondary"
                  className="ml-2"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancelar
                </Button>
              </Form>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalObservations;
