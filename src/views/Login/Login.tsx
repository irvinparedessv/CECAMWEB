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

// LoginForm.tsx

// LoginForm.tsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
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

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      const changePasswordValue = localStorage.getItem("changePassword");

      if (token && changePasswordValue === "false") {
        try {
          const user = await AuthService.getUserDetails();

          if (user.changePassword === false) {
            // Eliminar el token si no se requiere cambio de contraseña
            sessionStorage.removeItem("token");
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userId");
            localStorage.removeItem("changePassword");
          }
        } catch (error) {
          console.error("Error al verificar token:", error);
        }
      }
    };

    checkToken();
  }, []);

  const handleEmailOrUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailOrUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response: LoginResponse = await AuthService.loginUser(
        emailOrUsername,
        password
      );

      if (response.success && response.data) {
        const userInfo = {
          token: response.token,
          userName: response.data.userName,
          email: response.data.email,
          roleName: response.data.roleName,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          id: response.data.id,
          userPhoto: response.data.userPhoto,
          changePassword: response.data.changePassword,
        };

        sessionStorage.setItem("token", response.token ?? "");
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("userId", response.data.id.toString());
        localStorage.setItem("changePassword", response.data.changePassword.toString());

        if (response.data.changePassword === false) {
          // Mostrar SweetAlert2 para cambiar la contraseña
          const { value: newPassword } = await Swal.fire({
            title: "Cambia tu contraseña",
            html: `
              <div style="position: relative;">
                <input id="newPassword" class="swal2-input" type="password" placeholder="Nueva Contraseña">
                <label>
                  <input type="checkbox" id="show-new-password"> Mostrar Contraseña
                </label>
              </div>
              <div style="position: relative; margin-top: 10px;">
                <input id="confirmPassword" class="swal2-input" type="password" placeholder="Confirma tu Nueva Contraseña">
                <label>
                  <input type="checkbox" id="show-confirm-password"> Mostrar Contraseña
                </label>
              </div>
            `,
            focusConfirm: false,
            allowOutsideClick: false,
            showCancelButton: false,
            didOpen: () => {
              const newPasswordInput = document.getElementById('newPassword') as HTMLInputElement;
              const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
              const showNewPasswordCheckbox = document.getElementById('show-new-password') as HTMLInputElement;
              const showConfirmPasswordCheckbox = document.getElementById('show-confirm-password') as HTMLInputElement;

              showNewPasswordCheckbox.addEventListener('change', () => {
                newPasswordInput.type = showNewPasswordCheckbox.checked ? 'text' : 'password';
              });

              showConfirmPasswordCheckbox.addEventListener('change', () => {
                confirmPasswordInput.type = showConfirmPasswordCheckbox.checked ? 'text' : 'password';
              });
            },
            preConfirm: async () => {
              const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;
              const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;

              if (!newPassword || newPassword !== confirmPassword) {
                await Swal.showValidationMessage("Las contraseñas no coinciden");
                return false;
              }

              if (newPassword.length < 8 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
                await Swal.showValidationMessage('La contraseña debe tener al menos 8 caracteres, incluir minúsculas, mayúsculas y números.');
                return false;
              }

              try {
                // Cambiar la contraseña
                const changePasswordSuccess = await AuthService.changeTemporalPassword(response.data.id, newPassword);
                
                if (changePasswordSuccess) {
                  await Swal.fire("Contraseña cambiada correctamente", "", "success");

                  // Mueve el token de sessionStorage a localStorage después de cambiar la contraseña
                  const tokenFromSession = sessionStorage.getItem('token');
                  if (tokenFromSession) {
                    localStorage.setItem('token', tokenFromSession);
                    sessionStorage.removeItem('token');
                    localStorage.setItem('changePassword', "false");
                  }
                } else {
                  await Swal.fire("Error al cambiar la contraseña", "", "error");
                }
              } catch (error) {
                console.error("Error al cambiar la contraseña:", error);
                await Swal.fire("Error", "Hubo un problema al cambiar la contraseña", "error");
                return false;
              }

              return true;
            },
          });

          if (newPassword) {
            // Llama a la función de login para actualizar el estado global/contexto de la app
            login();

            // Redirigir según el rol del usuario
            if (response.data.roleName === "Administrador") {
              navigate("/adminDashboard");
            } else if (response.data.roleName === "Profesor") {
              navigate("/professorDashboard");
            } else {
              navigate("/students"); // Por defecto o para otros roles
            }

            // Limpiar los campos de entrada
            setEmailOrUsername("");
            setPassword("");
          }
        } else {
          localStorage.setItem("token", response.token ?? "");

          // Llama a la función de login para actualizar el estado global/contexto de la app
          login();

          // Redirigir según el rol del usuario
          if (response.data.roleName === "Administrador") {
            navigate("/adminDashboard");
          } else if (response.data.roleName === "Profesor") {
            navigate("/professorDashboard");
          } else {
            navigate("/students"); // Por defecto o para otros roles

            // Limpiar los campos de entrada
            setEmailOrUsername("");
            setPassword("");
          }
        }
      } else {
        setError(response.message || "Ocurrió un error.");
      }
    } catch (error) {
      setError("Error de API.");
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
                  <h3 className="display-4">¡Bienvenido!</h3>
                  <h4 className="mb-4">Ingresa tus credenciales.</h4>
                  {error && <div className="text-danger mb-3">{error}</div>}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group
                      controlId="formBasicEmailOrUsername"
                      className="mb-3"
                    >
                      <Form.Label>Correo o Nombre de Usuario</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese correo o nombre de usuario"
                        value={emailOrUsername}
                        onChange={handleEmailOrUsernameChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword" className="mb-3">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                    </Form.Group>
                    <Form.Group
                      controlId="formBasicCheckbox"
                      className="mb-3"
                    >
                      <Form.Check type="checkbox" label="Recuérdame" />
                    </Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      className="mb-2 rounded-pill shadow-sm"
                    >
                      Iniciar Sesión
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





