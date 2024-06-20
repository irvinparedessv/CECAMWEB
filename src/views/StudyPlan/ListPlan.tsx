import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importar Link desde react-router-dom
import Table from "react-bootstrap/Table";
import PlanService from "../../services/PlanService";
import { Plan } from "./../../types/Plans";

const ListPlan: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await PlanService.getPlans();
      setPlans(response);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  return (
    <div>
      <h2>Planes Estudiantiles</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Global Detalle</th>
            <th>Type Period</th>
            <th>Actions</th> {/* Nueva columna para acciones */}
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.planId}>
              <td>{plan.name}</td>
              <td>{!plan.isDetail ? "SI" : "NO"}</td>
              <td>{plan.type_period.typeName}</td>
              <td>
                <Link
                  to={`/plans/edit/${plan.planId}`}
                  className="btn btn-primary btn-sm"
                >
                  Detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListPlan;
