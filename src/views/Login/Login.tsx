import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./login.css";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  login: () => void; // Definimos el tipo de la función login como una función que no toma argumentos y no devuelve nada
}

const LoginForm: React.FC<LoginProps> = ({ login }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const response = await AuthService.loginUser(email, password);
      if (response.success) {
        // Crear un objeto con la información del usuario
        const userInfo = {
          token: response.token,
          username: response.data.userName,
          roleName: response.data.role,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          id: response.data.id
        };

        // Convertir el objeto a una cadena JSON y guardarlo en localStorage
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        login();
        navigate("/students");
        setEmail("");
        setPassword("");
      } else {
        setError(response.message || "An error occurred."); // Aquí se maneja el caso en el que 'message' es undefined
      }
    } catch (error) {
      setError("Error API.");
    }
  };

  return (
    <Container fluid>
      <Row className="no-gutter">
        {/* The image half */}
        <Col md={6} className="d-none d-md-flex bg-image"></Col>

        {/* The content half */}
        <Col md={6} className="bg-img">
          <div className="login d-flex align-items-center py-5">
            {/* Demo content*/}
            <Container>
              <Row>
                <Col lg={10} xl={7} className="mx-auto">
                  <h3 className="display-4">Bienvenido!</h3>
                  <h4 className="mb-4">Ingresa tus credenciales.</h4>
                  {error && <div className="text-danger mb-3">{error}</div>}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail" className="mb-3">
                      <Form.Label>Correo</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword" className="mb-3">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox" className="mb-3">
                      <Form.Check type="checkbox" label="Recuerdame" />
                    </Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      className="mb-2 rounded-pill shadow-sm"
                    >
                      Iniciar Sesion
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Container>
            {/* End Demo content */}
          </div>
        </Col>
        {/* End The content half */}
      </Row>
    </Container>
  );
};

export default LoginForm;
