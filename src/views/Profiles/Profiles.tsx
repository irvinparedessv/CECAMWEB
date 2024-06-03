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
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserInformation } from '../../types/Login';
import AuthService from '../../services/AuthService';
import UserService from '../../services/UserService';
import './profiles.css';
import axios, { AxiosError } from 'axios';

const Profiles = () => {
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  if (userInfo === null) {
    return null;
  }

  const { firstName, lastName, userName, rolId, userPhoto, email } = userInfo;
  const DEFAULT_USER_PHOTO_URL = 'http://localhost:8000/storage/userPhoto/default-user-photo.jpg';
  const userPhotoUrl = userPhoto ? `http://localhost:8000/storage/${userPhoto}` : DEFAULT_USER_PHOTO_URL;

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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const SwalLoading = ({ isLoading }: { isLoading: boolean }) => {
  useEffect(() => {
    if (isLoading) {
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
    } else {
      Swal.close();
    }
  }, [isLoading]);

  return null;
};

export default Profiles;
