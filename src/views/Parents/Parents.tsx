import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import ParentService from '../../services/ParentService';
import { Parent } from '../../types/Parent';
import { Rol } from '../../types/Rol';


const Parents = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
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
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    fetchParents();
    fetchRoles();
  }, []);

  const fetchParents = async () => {
    try {
      const parentList = await ParentService.getAllUsers();
      const filteredParents = parentList.filter(parent => parent.rolId === 2);
      setParents(filteredParents);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const roleList = await ParentService.getAllRols();
      setRoles(roleList);
    } catch (error) {
      console.error('Error al obtener roles:', error);
    }
  };

  const handleAddModalShow = (parentId: number | null) => {
    setSelectedParentId(parentId);
    setShowAddModal(true);
  
    if (parentId !== null) {
      const selectedParent = parents.find(parent => parent.id === parentId);
      if (selectedParent) {
        setNewParentData({
          id: selectedParent.id,
          userName: selectedParent.userName,
          email: selectedParent.email,
          password: '', // Debes decidir si permitir editar la contraseña
          firstName: selectedParent.firstName,
          lastName: selectedParent.lastName,
          enabled: selectedParent.enabled,
          rolId: selectedParent.rolId,
        });
      }
    } else {
      // Si es un nuevo padre, reinicia los datos
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
    }
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setNewParentData(prevState => ({
      ...prevState,
      rolId: parseInt(value),
    }));
  };

  const handleAddParent = async () => {
    try {
      await ParentService.insertUser(newParentData);
      setShowAddModal(false);
      fetchParents();
    } catch (error) {
      console.error('Error al insertar padre:', error);
    }
  };

  const handleUpdateParent = async () => {
    try {
      if (selectedParentId !== null) {
        await ParentService.updateUser(selectedParentId, newParentData);
        setShowAddModal(false);
        fetchParents();
      }
    } catch (error) {
      console.error('Error al actualizar padre:', error);
    }
  };

  const handleDeleteParent = async (parentId: number) => {
    try {
      await ParentService.deleteUser(parentId);
      fetchParents();
    } catch (error) {
      console.error('Error al eliminar padre:', error);
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
        <h1>Padres</h1>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Control
            type="text"
            placeholder="Buscar..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={{ width: '400px' }}
          />
          <Button variant="primary" onClick={() => handleAddModalShow(null)}>Agregar Padre</Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {parents
              .filter((parent) =>
                parent.userName.toLowerCase().includes(filterValue.toLowerCase())
              )
              .map((parent, index) => (
                <tr key={index}>
                  <td>{parent.userName}</td>
                  <td>{parent.email}</td>
                  <td>{parent.firstName}</td>
                  <td>{parent.lastName}</td>
                  <td>{parent.enabled ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    <Button variant="danger" className="mr-2" onClick={() => handleDeleteParent(parent.id)}>Eliminar</Button>
                    <Button variant="primary" onClick={() => handleAddModalShow(parent.id)}>Editar</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <Modal show={showAddModal} onHide={handleAddModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedParentId !== null ? 'Editar Padre' : 'Agregar Padre'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>Nombres</Form.Label>
                <Form.Control type="text" name="firstName" value={newParentData.firstName} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control type="text" name="lastName" value={newParentData.lastName} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={newParentData.email} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={newParentData.password} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formUserName">
                <Form.Label>Usuario</Form.Label>
                <Form.Control type="text" name="userName" disabled={true} value={newParentData.userName} onChange={handleInputChange} />
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
            <Button variant="primary" onClick={selectedParentId !== null ? handleUpdateParent : handleAddParent}>
              {selectedParentId !== null ? 'Guardar Cambios' : 'Agregar'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Parents;
