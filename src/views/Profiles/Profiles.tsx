// import React, { useEffect, useState } from 'react';
// import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { UserInformation } from '../../types/Login'; // Asegúrate de importar la interfaz correcta

// const Profiles = () => {
//   const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
//   const [photo, setPhoto] = useState<File | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUserInfo = localStorage.getItem('userInfo');
//     if (storedUserInfo) {
//       setUserInfo(JSON.parse(storedUserInfo));
//     } else {
//       navigate('/login');
//     }
//   }, [navigate]);

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setPhoto(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!photo) {
//       return;
//     }

//     const formData = new FormData();
//     formData.append('photo', photo);

//     try {
//       const response = await fetch('/uploadPhoto', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUserInfo(prevUserInfo => {
//           if (prevUserInfo === null) {
//             return null;
//           }
//           return { ...prevUserInfo, userPhoto: data.path };
//         });
//         localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, userPhoto: data.path }));
//       } else {
//         console.error('Error al cargar la foto');
//       }
//     } catch (error) {
//       console.error('Error al cargar la foto:', error);
//     }
//   };

//   if (userInfo === null) {
//     return null;
//   }

//   const { firstName, lastName, userName, roleName, userPhoto, id, email } = userInfo;

//   return (
//     <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//       <Row>
//         <Col>
//           <Card style={{ width: '18rem', textAlign: 'center' }}>
//             <Card.Img
//               variant="top"
//               src={`/userPhoto/${userPhoto}`} // Utiliza la ruta de la imagen del usuario desde tu API
//               alt={`${firstName} ${lastName}`}
//               style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '50%', margin: 'auto', marginTop: '20px' }}
//             />
//             <Card.Body>
//               <Card.Title>{`${firstName} ${lastName}`}</Card.Title>
//               <Card.Text>
//                 <strong>First Name:</strong> {firstName}
//               </Card.Text>
//               <Card.Text>
//                 <strong>Last Name:</strong> {lastName}
//               </Card.Text>
//               <Card.Text>
//                 <strong>Username:</strong> {userName}
//               </Card.Text>
//               <Card.Text>
//                 <strong>Role:</strong> {roleName}
//               </Card.Text>
//               <Card.Text>
//                 <strong>Role:</strong> {email}
//               </Card.Text>
//               <Card.Text>
//                 <strong>direccion foto:</strong> {userPhoto}
//               </Card.Text>
//               <Form onSubmit={handleSubmit}>
//                 <Form.Group controlId="formPhoto">
//                   <Form.Label>Cambiar Foto de Perfil:</Form.Label>
//                   <Form.Control type="file" onChange={handlePhotoChange} />
//                 </Form.Group>
//                 <Button variant="primary" type="submit">
//                   Guardar Foto
//                 </Button>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };
// Profiles.tsx

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserInformation } from '../../types/Login';
import UserService from '../../services/UserService';
import AuthService from '../../services/AuthService';
import './profiles.css';
import axios from 'axios';
import URL_STORAGE from '../../services/imageConfig';

const Profiles = () => {
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await AuthService.getUserDetails();
        setUserInfo(response);
      } catch (error) {
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedPhoto = e.target.files[0];

      // Validación previa en el cliente
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 2048 * 1024; // 2 MB

      if (!allowedTypes.includes(selectedPhoto.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Error al subir la foto',
          text: 'Formato de archivo no válido. Por favor, sube una imagen en formato jpeg, png o jpg.',
          allowOutsideClick: true,
        });
        return;
      }

      if (selectedPhoto.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'Error al subir la foto',
          text: 'El archivo excede el tamaño máximo permitido de 2 MB.',
          allowOutsideClick: true,
        });
        return;
      }

      setPhoto(selectedPhoto);

      const formData = new FormData();
      formData.append('photo', selectedPhoto);

      try {
        setIsLoading(true);
        Swal.fire({
          title: 'Cargando...',
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });

        await UserService.uploadPhoto(formData);

        const updatedUserInfo = await AuthService.getUserDetails();
        setUserInfo(updatedUserInfo);
        Swal.close();
      } catch (error) {
        Swal.close();
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 422) {
            Swal.fire({
              icon: 'error',
              title: 'Error al subir la foto',
              text: error.response.data.error || 'Formato de archivo no válido. Por favor, sube una imagen en formato jpeg, png o jpg.',
              allowOutsideClick: true,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al subir la foto',
              text: 'Ocurrió un error al intentar subir la foto. Por favor, intenta de nuevo más tarde.',
              allowOutsideClick: true,
            });
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

//   const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
  
//     try {
//       // Mostrar el primer SweetAlert para ingresar la contraseña actual
//       const { value: currentPassword } = await Swal.fire({
//         title: 'Ingresa tu Contraseña Actual',
//         input: 'password',
//         inputPlaceholder: 'Ingresa tu contraseña actual',
//         inputAttributes: {
//           required: 'true'
//         },
//         showCancelButton: true,
//         confirmButtonText: 'Siguiente',
//         cancelButtonText: 'Cancelar',
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//         inputValidator: (value) => {
//           if (!value) {
//             return 'Debes ingresar tu contraseña actual';
//           }
//         }
//       });
  
//       if (currentPassword) {
//         setIsLoading(true);
  
//         // Obtener el userId desde localStorage
//         const userId = localStorage.getItem('userId');
//         if (!userId) {
//           throw new Error('No se encontró el ID del usuario');
//         }
  
//         // Verificar la contraseña actual antes de continuar
//         const isPasswordCorrect = await UserService.verifyPassword(parseInt(userId, 10), currentPassword);
  
//         if (isPasswordCorrect) {
//           let newPassword: string | undefined;
  
//           const { value: newPwd } = await Swal.fire({
//             title: 'Ingresa y Confirma tu Nueva Contraseña',
//             html: `
//               <input id="swal-input1" class="swal2-input" type="password" placeholder="Ingresa tu nueva contraseña" required>
//               <input id="swal-input2" class="swal2-input" type="password" placeholder="Confirma tu nueva contraseña" required>
//             `,
//             focusConfirm: false,
//             showCancelButton: true,
//             confirmButtonText: 'Confirmar',
//             cancelButtonText: 'Cancelar',
//             allowOutsideClick: false,
//             allowEscapeKey: false,
//             preConfirm: () => {
//               newPassword = (document.getElementById('swal-input1') as HTMLInputElement).value;
//               const confirmedPassword = (document.getElementById('swal-input2') as HTMLInputElement).value;
  
//               if (newPassword !== confirmedPassword) {
//                 Swal.showValidationMessage('Las contraseñas no coinciden');
//                 return false;
//               }
//               if (newPassword.length < 3) {
//                 Swal.showValidationMessage('La contraseña debe tener al menos 8 caracteres');
//                 return false;
//               }
//               return newPassword;
//             }
//           });
  
//           if (!newPwd) {
//             // Si el usuario cancela, salir de la función
//             setIsLoading(false);
//             return;
//           }
  
//           // Llamar a UserService para cambiar la contraseña
//           const changeSuccess = await UserService.changePassword(parseInt(userId, 10), currentPassword, newPwd);
  
//           if (changeSuccess) {
//             Swal.fire({
//               icon: 'success',
//               title: 'Contraseña cambiada',
//               text: 'Tu contraseña ha sido cambiada exitosamente.',
//               allowOutsideClick: true,
//             });
//           } else {
//             Swal.fire({
//               icon: 'error',
//               title: 'Error',
//               text: 'Hubo un problema al intentar cambiar la contraseña.',
//               allowOutsideClick: true,
//             });
//           }
//         } else {
//           // Si la contraseña actual no es correcta, mostrar mensaje de error
//           Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'La contraseña actual es incorrecta.',
//             allowOutsideClick: true,
//           });
//         }
//       }
//     } catch (error) {
//       // Mostrar mensaje de error genérico en caso de fallos inesperados
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Ocurrió un error al intentar cambiar la contraseña.',
//         allowOutsideClick: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
// };
const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const { value: currentPassword } = await Swal.fire({
      title: 'Ingresa tu Contraseña Actual',
      html: `
        <div style="position: relative;">
          <input id="swal-input-current-password" class="swal2-input" type="password" placeholder="Ingresa tu contraseña actual" required>
          <label>
            <input type="checkbox" id="show-current-password"> Mostrar Contraseña
          </label>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Siguiente',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        const currentPasswordInput = document.getElementById('swal-input-current-password') as HTMLInputElement;
        const showCurrentPasswordCheckbox = document.getElementById('show-current-password') as HTMLInputElement;

        showCurrentPasswordCheckbox.addEventListener('change', () => {
          currentPasswordInput.type = showCurrentPasswordCheckbox.checked ? 'text' : 'password';
        });
      },
      preConfirm: () => {
        const currentPasswordInput = document.getElementById('swal-input-current-password') as HTMLInputElement;
        if (!currentPasswordInput.value) {
          Swal.showValidationMessage('Debes ingresar tu contraseña actual');
          return false;
        }
        return currentPasswordInput.value;
      }
    });

    if (currentPassword) {
      setIsLoading(true);

      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('No se encontró el ID del usuario');
      }

      const isPasswordCorrect = await UserService.verifyPassword(parseInt(userId, 10), currentPassword);

      if (isPasswordCorrect) {
        const { value: newPwd } = await Swal.fire({
          title: 'Ingresa y Confirma tu Nueva Contraseña',
          html: `
            <div style="position: relative;">
              <input id="swal-input1" class="swal2-input" type="password" placeholder="Ingresa tu nueva contraseña" required>
              <label>
                <input type="checkbox" id="show-password1"> Mostrar Contraseña
              </label>
            </div>
            <br>
            <div style="position: relative;">
              <input id="swal-input2" class="swal2-input" type="password" placeholder="Confirma tu nueva contraseña" required>
              <label>
                <input type="checkbox" id="show-password2"> Mostrar Contraseña
              </label>
            </div>
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            const passwordInput1 = document.getElementById('swal-input1') as HTMLInputElement;
            const passwordInput2 = document.getElementById('swal-input2') as HTMLInputElement;
            const showPassword1Checkbox = document.getElementById('show-password1') as HTMLInputElement;
            const showPassword2Checkbox = document.getElementById('show-password2') as HTMLInputElement;

            showPassword1Checkbox.addEventListener('change', () => {
              passwordInput1.type = showPassword1Checkbox.checked ? 'text' : 'password';
            });

            showPassword2Checkbox.addEventListener('change', () => {
              passwordInput2.type = showPassword2Checkbox.checked ? 'text' : 'password';
            });
          },
          preConfirm: () => {
            const passwordInput1 = document.getElementById('swal-input1') as HTMLInputElement;
            const passwordInput2 = document.getElementById('swal-input2') as HTMLInputElement;

            const newPasswordValue = passwordInput1.value;
            const confirmedPassword = passwordInput2.value;

            if (newPasswordValue !== confirmedPassword) {
              Swal.showValidationMessage('Las contraseñas no coinciden');
              return false;
            }

            if (newPasswordValue.length < 8 || !/[a-z]/.test(newPasswordValue) || !/[A-Z]/.test(newPasswordValue) || !/[0-9]/.test(newPasswordValue)) {
              Swal.showValidationMessage('La contraseña debe tener al menos 8 caracteres, incluir minúsculas, mayúsculas y números.');
              return false;
            }

            return newPasswordValue;
          }
        });

        if (!newPwd) {
          setIsLoading(false);
          return;
        }

        const changeSuccess = await UserService.changePassword(parseInt(userId, 10), currentPassword, newPwd);

        if (changeSuccess) {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña cambiada',
            text: 'Tu contraseña ha sido cambiada exitosamente.',
            allowOutsideClick: true,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al intentar cambiar la contraseña.',
            allowOutsideClick: true,
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La contraseña actual es incorrecta.',
          allowOutsideClick: true,
        });
      }
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al intentar cambiar la contraseña.',
      allowOutsideClick: true,
    });
  } finally {
    setIsLoading(false);
  }
};
  
  

  if (userInfo === null) {
    return null;
  }

  const { firstName, lastName, userName, rolId, userPhoto, email } = userInfo;
  const DEFAULT_USER_PHOTO_URL = URL_STORAGE+'userPhoto/default-user-photo.jpg';
  const userPhotoUrl = userPhoto ? URL_STORAGE+`${userPhoto}` : DEFAULT_USER_PHOTO_URL;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card>
            <Card.Header className="text-center">
              <h2>Perfil de Usuario</h2>
            </Card.Header>
            <Card.Body>
            <div className="text-center mb-3 position-relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <label htmlFor="photoInput">
                  <img src={userPhotoUrl} alt={`${firstName} ${lastName}`} className={`rounded-circle img-fluid ${isHovered ? 'blur' : ''}`} />
                  {isHovered && <p className="change-photo-message">Cambiar Foto</p>}
                  <input type="file" id="photoInput" accept=".jpeg,.jpg,.png" onChange={handlePhotoChange} style={{ display: 'none' }} />
                </label>
              </div>
              <hr />
              <div className="text-center">
                <h3 className="user-name">{`${firstName} ${lastName}`}</h3>
                <p><strong>Nombre de Usuario:</strong> {userName}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Rol:</strong> {rolId === 5 ? 'Administrador' : (rolId === 3 ? 'Profesor' : 'Otro')}</p>
              </div>
              <hr />
              <Form onSubmit={handleChangePassword} className="d-flex justify-content-center">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  Cambiar Contraseña
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
