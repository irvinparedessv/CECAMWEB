// import React, { useState } from 'react';
// import { Form, Button, Modal } from 'react-bootstrap';
// import './subject.css';

// const CombinedForm = () => {
//   const [año, setAño] = useState('');
//   const [seccion, setSeccion] = useState('');
//   const [nombre, setNombre] = useState('');
//   const [codigo, setCodigo] = useState('');
//   const [showModal, setShowModal] = useState(false);

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // Aquí puedes manejar la lógica para enviar los datos a tu backend
//     console.log('Año:', año);
//     console.log('Sección:', seccion);
//     console.log('Nombre:', nombre);
//     console.log('Código:', codigo);
//     // Reinicia los campos del formulario después de enviar los datos
//     setAño('');
//     setSeccion('');
//     setNombre('');
//     setCodigo('');
//     setShowModal(false);
//   };

//   const handleClose = () => setShowModal(false);
//   const handleShow = () => setShowModal(true);

//   return (
//     <div className="container">
//       <Button variant="primary" onClick={handleShow}>
//         Registrar Materia
//       </Button>

//       <Modal show={showModal} onHide={handleClose} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Registro de Materias</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="row">
//             <div className="col-lg-5 d-none d-lg-block">
//             <img src="../../assets/book.jpg" alt="Book" className="img-fluid" />
//             </div>
//             <div className="col-lg-7">
//               <Form className="requires-validation" noValidate onSubmit={handleSubmit}>
//                 <Form.Group controlId="formNombre">
//                   <Form.Label>Nombre</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Nombre"
//                     value={nombre}
//                     onChange={(e) => setNombre(e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group controlId="formCodigo">
//                   <Form.Label>Código</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Código"
//                     value={codigo}
//                     onChange={(e) => setCodigo(e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group controlId="formSeccion">
//                   <Form.Label>Grado</Form.Label>
//                   <Form.Select
//                     className="mt-3"
//                     value={seccion}
//                     onChange={(e) => setSeccion(e.target.value)}
//                     required
//                   >
//                     <option selected disabled value="">
//                       Encargado
//                     </option>
//                     <option value="jweb">Junior Web Developer</option>
//                     <option value="sweb">Senior Web Developer</option>
//                     <option value="pmanager">Project Manager</option>
//                   </Form.Select>
//                   <Form.Control.Feedback type="valid">You selected a position!</Form.Control.Feedback>
//                   <Form.Control.Feedback type="invalid">Please select a position!</Form.Control.Feedback>
//                 </Form.Group>
//                 <div className="form-button mt-3">
//                   <Button className="button-register" id="submit" type="submit" variant="primary">
//                     Guardar
//                   </Button>
//                 </div>
//               </Form>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default CombinedForm;


import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import SubjectService from '../../services/SubjectService';
import { Subject } from '../../types'; // Importa la interfaz Subject

const SubjectForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [code, setCode] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Nuevo estado para el término de búsqueda
  const [errorMessage, setErrorMessage] = useState('');

  const fetchSubjects = async () => {
    try {
      const subjectsData = await SubjectService.getAllSubjects();
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setErrorMessage('Error al cargar las materias. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleEdit = (subject: Subject) => {
    setSubjectId(subject.subjectId);
    setSubjectName(subject.subjectName);
    setCode(subject.code);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (subjectId !== null) {
        await SubjectService.updateSubject(subjectId, subjectName, code);
        Swal.fire('Actualizado', 'Materia actualizada correctamente.', 'success');
      } else {
        await SubjectService.createSubject(subjectName, code);
        Swal.fire('Guardado', 'Materia creada correctamente.', 'success');
      }
      fetchSubjects();
      setShowModal(false);
      setSubjectId(null);
      setSubjectName('');
      setCode('');
    } catch (error) {
      console.error('Error creando/actualizando materia:', error);
      setErrorMessage('Error al crear/actualizar la materia. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleDelete = async (subjectId: number) => {
    try {
      await SubjectService.deleteSubject(subjectId);
      fetchSubjects();
      Swal.fire('Eliminado', 'Materia eliminada correctamente.', 'success');
    } catch (error) {
      console.error('Error eliminando materia:', error);
      setErrorMessage('Error al eliminar la materia. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const confirmDelete = (subjectId: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(subjectId);
      }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredSubjects = subjects.filter(
    subject =>
      subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre o código"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ width: '300px' }} // Ajusta el tamaño del campo de búsqueda
        />
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Registrar Materia
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{subjectId !== null ? 'Editar Materia' : 'Registrar Materia'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formSubjectName">
              <Form.Label>Nombre de la Materia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre de la Materia"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCode">
              <Form.Label>Código de la Materia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Código de la Materia"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {subjectId !== null ? 'Actualizar' : 'Guardar'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre de la Materia</th>
            <th>Código de la Materia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubjects.map((subject) => (
            <tr key={subject.subjectId}>
              <td>{subject.subjectName}</td>
              <td>{subject.code}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(subject)}>
                  Editar
                </Button>{' '}
                <Button variant="danger" onClick={() => confirmDelete(subject.subjectId)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SubjectForm;


