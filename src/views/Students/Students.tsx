import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import StudentService from '../../services/StudentService';
import { Student } from '../../types';
import { Rol } from '../../types/Rol';
import Swal from 'sweetalert2';
import { Spinner } from 'react-bootstrap';

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [newStudentData, setNewStudentData] = useState<Student>({
    id: 0,
    userName: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    enabled: true,
    rolId: 1,
  });
  const [deletingStudentId, setDeletingStudentId] = useState<number | null>(null);
  const [deletingStudent, setDeletingStudent] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  useEffect(() => {
    fetchStudents();
    fetchRoles();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentList = await StudentService.getAllUsers();
      const filteredStudents = studentList.filter(student => student.rolId === 1);
      setStudents(filteredStudents);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const roleList = await StudentService.getAllRols();
      setRoles(roleList);
    } catch (error) {
      console.error('Error al obtener roles:', error);
    }
  };

  const handleAddModalShow = (studentId: number | null) => {
    setSelectedStudentId(studentId);
    setShowAddModal(true);
  
    if (studentId !== null) {
      const selectedStudent = students.find(student => student.id === studentId);
      if (selectedStudent) {
        setNewStudentData({
          id: selectedStudent.id,
          userName: selectedStudent.userName,
          email: selectedStudent.email,
          password: '',
          firstName: selectedStudent.firstName,
          lastName: selectedStudent.lastName,
          enabled: selectedStudent.enabled,
          rolId: selectedStudent.rolId,
        });
      }
    } else {
      setNewStudentData({
        id: 0,
        userName: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        enabled: true,
        rolId: 1,
      });
    }
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    setSelectedStudentId(null);
    setNewStudentData({
      id: 0,
      userName: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      enabled: true,
      rolId: 1,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudentData(prevState => {
      const updatedData = {
        ...prevState,
        [name]: value,
      };
      if (name === 'firstName' || name === 'lastName') {
        updatedData.userName = generateUserName(updatedData.firstName, updatedData.lastName);
      }
      return updatedData;
    });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setNewStudentData(prevState => ({
      ...prevState,
      rolId: parseInt(value),
    }));
  };

  const handleAddStudent = async () => {
    try {
      await StudentService.insertUser(newStudentData);
      setShowAddModal(false);
      fetchStudents();
    } catch (error) {
      console.error('Error al insertar estudiante:', error);
    }
  };

  const handleUpdateStudent = async () => {
    try {
      if (selectedStudentId !== null) {
        await StudentService.updateUser(selectedStudentId, newStudentData);
        setShowAddModal(false);
        fetchStudents();
      }
    } catch (error) {
      console.error('Error al actualizar estudiante:', error);
    }
  };

  // const handleDeleteStudent = async (studentId: number) => {
  //   try {
      
  //   } catch (error) {
  //     console.error('Error al eliminar estudiante:', error);
  //   }
  // };

  const handleDeleteStudent = async (student: Student) => {

    try {
      setDeletingStudentId(student.id);
      setDeletingStudent(true);
  
      // Mostrar la alerta de confirmación
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el padre asociado.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'
      });
  
      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        // Realizar la solicitud para eliminar el registro utilizando el servicio
        await StudentService.deleteUser(student.id);
         fetchStudents();
  
        // Mostrar una alerta de éxito después de que se complete la eliminación
        Swal.fire(
          'Eliminado',
          'El padre asociado ha sido eliminado correctamente.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      // Mostrar una alerta de error si ocurre algún problema durante la eliminación
      Swal.fire(
        'Error',
        'Se produjo un error al eliminar el padre asociado.',
        'error'
      );
    }
    finally {
      setDeletingStudentId(null);
      setDeletingStudent(false);
    }
  };






  const generateUserName = (firstName: string, lastName: string): string => {
    if (!firstName || !lastName) {
      return '';
    }
    const firstInitial = firstName;
    const lastInitial = lastName.substring(0, 2);
    return `${firstInitial.toLowerCase()}${lastInitial.toLowerCase()}24`;
  };


  return (
    <div className="content">
      <div className="container">
        <h1>Estudiantes</h1>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Control
            type="text"
            placeholder="Buscar..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={{ width: '400px' }}
          />
          <Button variant="primary" onClick={() => handleAddModalShow(null)}>Agregar Estudiante</Button>
        </div>
        
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Nombre del estudiante</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter((student) => {
                      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
                      const searchValue = filterValue.toLowerCase();
                      return fullName.includes(searchValue);
                    })
              .map((student, index) => (
                <tr key={index}>
                  <td>{student.userName}</td>
                  <td>{student.email}</td>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>{student.enabled ? 'Activo' : 'Inactivo'}</td>
                  <td>
                  <Button
                  variant="danger"
                  onClick={() => handleDeleteStudent(student)}
                  disabled={deletingStudentId === student.id}
                >
                  {deletingStudentId === student.id && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: '5px' }}
                    />
                  )}
                  {deletingStudentId === student.id ? 'Eliminando...' : 'Eliminar'}
                </Button>
                    {/* <Button variant="danger" className="mr-2" onClick={() => handleDeleteStudent(student.id)}>Eliminar</Button> */}
                    <Button variant="primary" onClick={() => handleAddModalShow(student.id)}>Editar</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        <Modal show={showAddModal} onHide={handleAddModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedStudentId !== null ? 'Editar Estudiante' : 'Agregar Estudiante'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>Nombres</Form.Label>
                <Form.Control type="text" name="firstName" value={newStudentData.firstName} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control type="text" name="lastName" value={newStudentData.lastName} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={newStudentData.email} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={newStudentData.password} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formUserName">
                <Form.Label>Usuario</Form.Label>
                <Form.Control type="text" name="userName" disabled={true} value={newStudentData.userName} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formEnabled">
                <Form.Label>Estado</Form.Label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Form.Check
                    type="checkbox"
                    name="enabled"
                    label="Activo"
                    checked={newStudentData.enabled}
                    readOnly={true}
                    disabled={!selectedStudentId}
                    onChange={() => setNewStudentData(prevState => ({ ...prevState, enabled: true }))}
                    style={{ marginRight: '10px' }}
                  />
                  <Form.Check
                    type="checkbox"
                    name="enabled"
                    label="Inactivo"
                    checked={!newStudentData.enabled}
                    readOnly={true}
                    disabled={!selectedStudentId}
                    onChange={() => setNewStudentData(prevState => ({ ...prevState, enabled: false }))}
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="formRoleId">
                <Form.Label>Rol</Form.Label>
                <Form.Control as="select" disabled={true} name="rolId" value={newStudentData.rolId} onChange={handleRoleChange}>
                {/* <Form.Control as="select" name="rolId"  value={newStudentData.rolId}> */}
                  <option value="">Seleccionar Rol</option>
                  {roles.map((role, index) => (
                    <option key={index} value={role.rolId}>{role.roleName}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>Cancelar</Button>
            <Button variant="primary" onClick={selectedStudentId !== null ? handleUpdateStudent : handleAddStudent}>
              {selectedStudentId !== null ? 'Guardar Cambios' : 'Agregar'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Students;
