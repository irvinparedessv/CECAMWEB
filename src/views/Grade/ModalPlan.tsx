import React, { useState } from "react";
import { Modal, Button, Table, Spinner } from "react-bootstrap";
import { Plan } from "../../types/Plans";
import PlanService from "../../services/PlanService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddPlanModalProps {
  gradeId: number;
  selectedPlan: Plan | null;
  plans: Plan[];
  handleCloseModal: (shouldClose: boolean) => void;
}

const AddPlanModal: React.FC<AddPlanModalProps> = ({
  gradeId,
  selectedPlan,
  plans,
  handleCloseModal,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [planToAdd, setPlanToAdd] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelectPlan = (plan: Plan) => {
    setPlanToAdd(plan);
    setShowConfirmation(true);
  };

  const handleConfirmAddPlan = async () => {
    if (planToAdd) {
      setIsLoading(true);
      // Simula una llamada asíncrona al servicio para agregar el plan
      try {
        await PlanService.addPlan(gradeId, planToAdd);
        // Mostrar notificación de éxito
        toast.success("Plan agregado exitosamente");
        setIsLoading(false);
        setShowConfirmation(false);
        handleCloseModal(false);
        navigate("/plans");
      } catch (error) {
        console.error("Error al agregar el plan:", error);
        setIsLoading(false);
        // Mostrar notificación de error
        toast.error("Error al agregar el plan");
      }
    }
  };

  const handleCancelAddPlan = () => {
    setShowConfirmation(false);
  };

  const filteredPlans = plans.filter(
    (plan) => plan.planId !== selectedPlan?.planId
  );

  return (
    <>
      <Modal
        show={true}
        onHide={() => handleCloseModal(false)}
        dialogClassName="modal-xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Asociar Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div>
              {selectedPlan && <h1>Plan Actual</h1>}
              {selectedPlan && (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Nombre del plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={selectedPlan.planId}>
                      <td>{selectedPlan.name}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </div>

            <div>
              <h1>Planes disponibles</h1>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nombre del plan</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlans.map((plan, index) => (
                    <tr key={index}>
                      <td>{plan.name}</td>
                      <td>
                        <Button
                          variant="btn btn-secondary"
                          onClick={() => handleSelectPlan(plan)}
                        >
                          Agregar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación */}
      <Modal show={showConfirmation} onHide={handleCancelAddPlan}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <>
              {selectedPlan ? (
                <p>
                  ¿Deseas agregar este plan y reemplazar el plan actual
                  seleccionado?
                </p>
              ) : (
                <p>¿Deseas agregar este plan?</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelAddPlan}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmAddPlan}
            disabled={isLoading}
          >
            {isLoading ? "Agregando..." : "Sí"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddPlanModal;
