import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const role = userInfo.roleName;

    if (role !== 'Administrador') {
      // Redirigir al usuario si no tiene el rol adecuado, PUEDO CREAR UNA PAGINA DE ACCESO DENEGADO Y REDIRECCIONARLO AHI
      navigate('/professorDashboard');
    }
  }, [navigate]);

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row>
        <Col>
          <h1>Administrador</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
