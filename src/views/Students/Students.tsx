import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import StudentService from '../../services/StudentService';
import ParentService from '../../services/ParentService';
import { Student } from '../../types';
import { Rol } from '../../types/Rol';
import { Parent } from '../../types/Parent';

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
  const [filterValue, setFilterValue] = useState('');
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [selectedParentStudent, setSelectedParentStudent] = useState<Student | null>(null);

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

  const handleDeleteStudent = async (studentId: number) => {
    try {
      await StudentService.deleteUser(studentId);
      fetchStudents();
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
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

 const [parents, setParents] = useState<Parent[]>([]);
 const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [newParentData, setNewParentData] = useState<Parent>({
    id: 0,
    userName: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    enabled: true,
    rolId: 2,
  });
  const fetchParents = async () => {
    try {
      const parentList = await ParentService.getAllUsers();
      const filteredParents = parentList.filter(parent => parent.rolId === 2);
      setParents(filteredParents);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleInputChangeParent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewParentData(prevState => {
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

  const handleAddParentModalShow = (studentId: number) => {
    const selectedStudent = students.find(student => student.id === studentId);
    setSelectedParentStudent(selectedStudent || null);
    setShowAddParentModal(true);
   
      setNewParentData({
        id: 0,
        userName: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        enabled: true,
        rolId: 2,
      });
    
  };

  const handleAddParentModalClose = () => {
    setShowAddParentModal(false);
    setSelectedParentStudent(null);
    setSelectedParentId(null);
    setNewParentData({
      id: 0,
      userName: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      enabled: true,
      rolId: 2,
    });
  };

  const handleAddParent = async () => {
    try {
      if (selectedParentStudent) {
        await ParentService.insertUser(newParentData);
        setShowAddModal(false);
        fetchParents();
        // Aquí puedes agregar la lógica para guardar la información del padre para el estudiante seleccionado
        console.log("ID del estudiante:", selectedParentStudent.id);
        console.log("Nombres:", selectedParentStudent.firstName);
        console.log("Apellidos:", selectedParentStudent.lastName);
        handleAddParentModalClose(); // Cerrar el modal después de guardar la información
      }
    } catch (error) {
      console.error('Error al agregar padre:', error);
    }
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
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Estado</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter((student) =>
                student.userName.toLowerCase().includes(filterValue.toLowerCase())
              )
              .map((student, index) => (
                <tr key={index}>
                  <td>{student.userName}</td>
                  <td>{student.email}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.enabled ? 'Activo' : 'Inactivo'}</td>
                  <td>{roles.length > 0 ? roles.find(role => role.rolId === student.rolId)?.roleName : ''}</td>
                  <td>
                    <Button variant="danger" className="mr-2" onClick={() => handleDeleteStudent(student.id)}>Eliminar</Button>
                    <Button variant="primary" onClick={() => handleAddModalShow(student.id)}>Editar</Button>
                    <Button variant="success" onClick={() => handleAddParentModalShow(student.id)}>Agregar padre</Button>
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

        <Modal show={showAddParentModal} onHide={handleAddParentModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Agregar Padre</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedParentStudent && (
              <div>
                <p>ID del Estudiante: {selectedParentStudent.id}</p>
                <p>Nombres: {selectedParentStudent.firstName}</p>
                <p>Apellidos: {selectedParentStudent.lastName}</p>
              </div>
            )}
          <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>Nombres</Form.Label>
                <Form.Control type="text" name="firstName" value={newParentData.firstName} onChange={handleInputChangeParent} />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control type="text" name="lastName" value={newParentData.lastName} onChange={handleInputChangeParent} />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={newParentData.email} onChange={handleInputChangeParent} />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={newParentData.password} onChange={handleInputChangeParent} />
              </Form.Group>
              <Form.Group controlId="formUserName">
                <Form.Label>Usuario</Form.Label>
                <Form.Control type="text" name="userName" disabled={true} value={newParentData.userName} onChange={handleInputChangeParent} />
              </Form.Group>
              <Form.Group controlId="formEnabled">
                <Form.Label>Estado</Form.Label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Form.Check
                    type="checkbox"
                    name="enabled"
                    label="Activo"
                    checked={newParentData.enabled}
                    readOnly={true}
                    disabled={!selectedParentId}
                    onChange={() => setNewParentData(prevState => ({ ...prevState, enabled: true }))}
                    style={{ marginRight: '10px' }}
                  />
                  <Form.Check
                    type="checkbox"
                    name="enabled"
                    label="Inactivo"
                    checked={!newParentData.enabled}
                    readOnly={true}
                    disabled={!selectedParentId}
                    onChange={() => setNewParentData(prevState => ({ ...prevState, enabled: false }))}
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="formRoleId">
                <Form.Label>Rol</Form.Label>
                <Form.Control as="select" disabled={true} name="rolId" value={newParentData.rolId} onChange={handleRoleChange}>
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
            <Button variant="secondary" onClick={handleAddParentModalClose}>Cancelar</Button>
            <Button variant="primary" onClick={handleAddParent}>Guardar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Students;
