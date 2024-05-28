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

// export default Profiles;


import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserInformation } from '../../types/Login'; // Asegúrate de importar la interfaz correcta
import AuthService from '../../services/AuthService'; // Importa tu servicio AuthService
import UserService from '../../services/UserService';

const Profiles = () => {
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await AuthService.getUserDetails();
        setUserInfo(response);
      } catch (error) {
        console.error('Error al obtener los detalles del usuario:', error);
        navigate('/login');
      }
    };

    fetchUserInfo();
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
      const updatedUserInfo = await UserService.uploadPhoto(formData);
      setUserInfo(updatedUserInfo);
    } catch (error) {
      console.error('Error al cargar la foto:', error);
    }
  };

  if (userInfo === null) {
    return null;
  }

  const { firstName, lastName, userName, rolId, userPhoto, id, email } = userInfo;
  const DEFAULT_USER_PHOTO_URL = 'http://localhost:8000/storage/userPhoto/default-user-photo.jpg';

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row>
        <Col>
          <Card style={{ width: '18rem', textAlign: 'center' }}>
            <Card.Img
              variant="top"
              src={userPhoto ? `/storage/${userPhoto}` : DEFAULT_USER_PHOTO_URL}
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
                <strong>Rol:</strong> {rolId === 5 ? 'Administrador' : (rolId === 3 ? 'Profesor' : 'Otro')}
              </Card.Text>
              <Card.Text>
                <strong>Email:</strong> {email}
              </Card.Text>
              <Card.Text>
                <strong>Photo Path:</strong> {userPhoto}
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
