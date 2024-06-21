import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import StudentService from "../../../services/StudentService";

const ModalObservations = ({ show, handleClose, studentId }) => {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        ) : observations.length === 0 ? (
          <p>No existen observaciones para este estudiante.</p>
        ) : (
          <ul>
            {observations.map((observation) => (
              <li key={observation.observationId}>
                {observation.date}: {observation.description}
              </li>
            ))}
          </ul>
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
