import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfessorDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const role = userInfo.roleName;

    if (role !== 'Profesor') {
      // Redirigir al usuario si no tiene el rol adecuado
      navigate('/adminDashboard');
    }
  }, [navigate]);

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row>
        <Col>
          <h1>Profesor</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfessorDashboard;
