import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import defaultUserPhoto from './user.jpg'; // Importa la imagen predeterminada
import { UserInformation } from '../../types/Login'; // Asegúrate de importar la interfaz correcta

const Profiles = () => {
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null); // Asegúrate de especificar el tipo de estado
  const [photo, setPhoto] = useState<File | null>(null); // Asegúrate de especificar el tipo de estado para la foto
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      // Redirigir a otra página si no hay información del usuario
      navigate('/login');
    }
  }, [navigate]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!photo) {
      return;
    }

    const formData = new FormData();
    formData.append('photo', photo);

    try {
      const response = await fetch('/uploadPhoto', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(prevUserInfo => {
          if (prevUserInfo === null) {
            return null; // Retorna null si userInfo es null
          }
          return { ...prevUserInfo, userPhoto: data.path };
        });
        localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, userPhoto: data.path }));
      } else {
        console.error('Error al cargar la foto');
      }
    } catch (error) {
      console.error('Error al cargar la foto:', error);
    }
  };

  if (userInfo === null) {
    return null; // O mostrar un mensaje de carga, dependiendo de la implementación
  }

  const { firstName, lastName, userName, role } = userInfo;

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row>
        <Col>
          <Card style={{ width: '18rem', textAlign: 'center' }}>
            <Card.Img
              variant="top"
              // src={userPhoto ? userPhoto : defaultUserPhoto} // Si userPhoto es null, muestra la imagen predeterminada
              alt={`${firstName} ${lastName}`}
              style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '50%', margin: 'auto', marginTop: '20px' }}
            />
            <Card.Body>
              <Card.Title>{`${firstName} ${lastName}`}</Card.Title>
              <Card.Text>
                <strong>First Name:</strong> {firstName}
              </Card.Text>
              <Card.Text>
                <strong>Last Name:</strong> {lastName}
              </Card.Text>
              <Card.Text>
                <strong>Username:</strong> {userName}
              </Card.Text>
              <Card.Text>
                <strong>Role:</strong> {role}
              </Card.Text>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formPhoto">
                  <Form.Label>Cambiar Foto de Perfil:</Form.Label>
                  <Form.Control type="file" onChange={handlePhotoChange} />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Guardar Foto
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profiles;
