import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importar Link desde react-router-dom
import Table from "react-bootstrap/Table";
import PlanService from "../../services/PlanService";
import { Plan } from "./../../types/Plans";
import { Form, Pagination } from "react-bootstrap";
import { itemsPerPage } from "../../const/Pagination";

const ListPlan: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para el término de búsqueda

  useEffect(() => {
    fetchPlans();
  }, [currentPage, searchTerm]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handlePageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const fetchPlans = async () => {
    try {
      const params = {
        page: currentPage,
        size: itemsPerPage,
        filter: searchTerm,
      };
      const response = await PlanService.getPlans(params);
      console.log(response);
      setPlans(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  return (
    <div>
      <h2>Planes Estudiantiles</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre o código"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ width: "300px" }} // Ajusta el tamaño del campo de búsqueda
        />
      </div>
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
      <Pagination>
        {[...Array(totalPages)].map((_, pageIndex) => (
          <Pagination.Item
            key={pageIndex + 1}
            active={pageIndex + 1 === currentPage}
            onClick={() => handlePageChange(pageIndex + 1)}
          >
            {pageIndex + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default ListPlan;
