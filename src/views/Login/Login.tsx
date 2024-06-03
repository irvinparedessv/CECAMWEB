// import React, { useState } from "react";
// import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import "./login.css";
// import AuthService from "../../services/AuthService";
// import { useNavigate } from "react-router-dom";

// interface LoginProps {
//   login: () => void;
// }

// const LoginForm: React.FC<LoginProps> = ({ login }) => {
//   const navigate = useNavigate();
//   const [emailOrUsername, setEmailOrUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleEmailOrUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setEmailOrUsername(e.target.value);
//   };

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword(e.target.value);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const response = await AuthService.loginUser(emailOrUsername, password);
//       if (response.success && response.data) {
//         const userInfo = {
//           token: response.token,
//           username: response.data.userName,
//           roleName: response.data.role,
//           firstName: response.data.firstName,
//           lastName: response.data.lastName,
//           id: response.data.id,
//         };

//         localStorage.setItem("token", response.token ?? "");
//         localStorage.setItem("userInfo", JSON.stringify(userInfo));

//         login();
//         navigate("/students");
//         setEmailOrUsername("");
//         setPassword("");
//       } else {
//         setError(response.message || "An error occurred.");
//       }
//     } catch (error) {
//       setError("Error API.");
//     }
//   };

//   return (
//     <Container fluid>
//       <Row className="no-gutter">
//         <Col md={6} className="d-none d-md-flex bg-image"></Col>
//         <Col md={6} className="bg-img">
//           <div className="login d-flex align-items-center py-5">
//             <Container>
//               <Row>
//                 <Col lg={10} xl={7} className="mx-auto">
//                   <h3 className="display-4">Bienvenido!</h3>
//                   <h4 className="mb-4">Ingresa tus credenciales.</h4>
//                   {error && <div className="text-danger mb-3">{error}</div>}
//                   <Form onSubmit={handleSubmit}>
//                     <Form.Group controlId="formBasicEmailOrUsername" className="mb-3">
//                       <Form.Label>Correo o Nombre de Usuario</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Enter email or username"
//                         value={emailOrUsername}
//                         onChange={handleEmailOrUsernameChange}
//                       />
//                     </Form.Group>
//                     <Form.Group controlId="formBasicPassword" className="mb-3">
//                       <Form.Label>Contraseña</Form.Label>
//                       <Form.Control
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={handlePasswordChange}
//                       />
//                     </Form.Group>
//                     <Form.Group controlId="formBasicCheckbox" className="mb-3">
//                       <Form.Check type="checkbox" label="Recuerdame" />
//                     </Form.Group>
//                     <Button
//                       variant="primary"
//                       type="submit"
//                       className="mb-2 rounded-pill shadow-sm"
//                     >
//                       Iniciar Sesion
//                     </Button>
//                   </Form>
//                 </Col>
//               </Row>
//             </Container>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default LoginForm;


import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./login.css";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { LoginResponse } from "../../types"; // Asegúrate de importar tus tipos

interface LoginProps {
  login: () => void;
}

const LoginForm: React.FC<LoginProps> = ({ login }) => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailOrUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailOrUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response: LoginResponse = await AuthService.loginUser(emailOrUsername, password);

      if (response.success && response.data) {
        const userInfo = {
          token: response.token,
          userName: response.data.userName,
          email: response.data.email,
          roleName: response.data.roleName,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          id: response.data.id,
          userPhoto: response.data.userPhoto // Añadir el campo userPhoto aquí
        };

        localStorage.setItem("token", response.token ?? "");
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        // Redirigir según el rol del usuario
        if (response.data.roleName === "Administrador") {
          navigate("/adminDashboard");
        } else if (response.data.roleName === "Profesor") {
          navigate("/professorDashboard");
        } else {
          navigate("/students"); // Por defecto o para otros roles
        }

        // Llama a la función de login para actualizar el estado global/contexto de la app
        login();

        // Limpiar los campos de entrada
        setEmailOrUsername("");
        setPassword("");
      } else {
        setError(response.message || "An error occurred.");
      }
    } catch (error) {
      setError("Error API.");
    }
  };

  return (
    <Container fluid>
      <Row className="no-gutter">
        <Col md={6} className="d-none d-md-flex bg-image"></Col>
        <Col md={6} className="bg-img">
          <div className="login d-flex align-items-center py-5">
            <Container>
              <Row>
                <Col lg={10} xl={7} className="mx-auto">
                  <h3 className="display-4">Bienvenido!</h3>
                  <h4 className="mb-4">Ingresa tus credenciales.</h4>
                  {error && <div className="text-danger mb-3">{error}</div>}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmailOrUsername" className="mb-3">
                      <Form.Label>Correo o Nombre de Usuario</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter email or username"
                        value={emailOrUsername}
                        onChange={handleEmailOrUsernameChange}
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
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;


