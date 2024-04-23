import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import StudentService from '../../services/StudentService';
import ParentService from '../../services/ParentService';
import { Student } from '../../types';
import { Rol } from '../../types/Rol';
import { Parent } from '../../types/Parent';
import { ParentAssociation } from '../../types';
import ParentAssociationService from '../../services/ParentAssociationService';

const ParentAssociations = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  
  const [filterValue, setFilterValue] = useState('');
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [showParentAssociationModal, setShowParentAssociationModal] = useState(false);

  const [selectedParentStudent, setSelectedParentStudent] = useState<Student | null>(null);
  const [parents, setParents] = useState<Parent[]>([]);
  const [parentAssociations, setParentsAssociations] = useState<ParentAssociation[]>([]);
  const [filterValueParent, setFilterValueParent] = useState('');
  const [selectedParents, setSelectedParents] = useState<ParentAssociation[]>([]);
  const [loading, setLoading] = useState(false);
  const [unassociatedParents, setUnassociatedParents] = useState<ParentAssociation[]>([]);




const ParentAssociations = () => {
  const [unassociatedParents, setUnassociatedParents] = useState([]);

  useEffect(() => {
    fetchUnassociatedParents();
  }, []);

}

const fetchUnassociatedParents = async () => {
  try {
    const studentId = 5; // Reemplaza con el ID del estudiante deseado
    const parents = await ParentAssociationService.getUnassociatedParents(studentId);
    setUnassociatedParents(() => [...parents]); // Actualiza el estado con los padres no asociados
  } catch (error) {
    console.error('Error al obtener padres no asociados:', error);
  }
};





  useEffect(() => {
    fetchStudents();
    fetchRoles();
    fetchParents();
    // fetchUnassociatedParents();
  }, []);

  // useEffect(() => {
  //   if (selectedParentStudent) {
  //     fetchUnassociatedParents(selectedParentStudent.id);
  //   }
  // }, [selectedParentStudent]);

  // const fetchUnassociatedParents = async (studentId: number) => {
  //   try {
  //     const unassociatedParents = await ParentAssociationService.getUnassociatedParents(studentId);
  //     setUnassociatedParents(unassociatedParents);
  //   } catch (error) {
  //     console.error('Error al obtener padres no asociados:', error);
  //   }
  // };
  // const fetchUnassociatedParents = async () => {
  //   try {
  //     const studentId = 5; // Aquí debes proporcionar el ID del estudiante deseado
  //     const unassociatedParents = await ParentAssociationService.getUnassociatedParents(studentId);
  //     // Actualiza el estado con los padres no asociados
  //     setUnassociatedParents(unassociatedParents);
  //   } catch (error) {
  //     console.error('Error al obtener padres no asociados:', error);
  //   }
  // };
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
  
  

  const handleAddParentModalShow = async (studentId: number) => {
    const selectedStudent = students.find(student => student.id === studentId);
    setSelectedParentStudent(selectedStudent || null);
    if (selectedStudent) {
      setLoading(true);
      const unassociatedParents = await ParentAssociationService.getUnassociatedParents(selectedStudent.id);
      setUnassociatedParents(unassociatedParents);
        const parentAssociations = await ParentAssociationService.getUsersWithParentAssociations(selectedStudent.id);
        setParentsAssociations(parentAssociations);
        setLoading(false);
    setShowAddParentModal(true);
    }
    
  };

  const handleAddParentModalClose = () => {
    setShowAddParentModal(false);
    setSelectedParentStudent(null);
    setSelectedParents([]);
  };

  const handleParentAssociationModalClose = () => {
    setShowParentAssociationModal(false);
    setSelectedParentStudent(null);
    setSelectedParents([]);
  };


  const handleManageParents = async (studentId: number) => {
    try {
      const student = students.find(student => student.id === studentId);
      if (student) {
        setSelectedParentStudent(student);
        setLoading(true);
        const parentAssociations = await ParentAssociationService.getUsersWithParentAssociations(student.id);
        setParentsAssociations(parentAssociations);
        setLoading(false);
        setShowParentAssociationModal(true);
      }
    } catch (error) {
      console.error('Error al obtener asociaciones de padres:', error);
    }
  };






  const handleSelectParent = (parent: ParentAssociation) => {
    const isSelected = selectedParents.some(p => p.id === parent.id);
    if (isSelected) {
      setSelectedParents(selectedParents.filter(p => p.id !== parent.id));
    } else {
      setSelectedParents([...selectedParents, parent]);
    }
  };

  


  const handleAddParent = async () => {
    try {
      if (selectedParentStudent && selectedParents.length > 0) {
        await ParentAssociationService.saveParentAssociations(selectedParentStudent.id, selectedParents.map(parent => parent.id));
        console.log('Asociaciones de padres guardadas correctamente');
        handleAddParentModalClose();
      } else {
        console.error('Por favor, seleccione al menos un padre');
      }
    } catch (error) {
      console.error('Error al guardar las asociaciones de padres:', error);
    }
  };

  const handleDeleteSelectedParent = (parentId: number) => {
    setSelectedParents(selectedParents.filter(parent => parent.id !== parentId));
  };


  const handleDeleteParent = async (parentId: number) => {
    try {
      // Realizar la solicitud para eliminar el registro utilizando el servicio
      await ParentAssociationService.deleteParentAssociation(parentId);
      // Actualizar la lista de asociaciones de padres después de eliminar
      const updatedParentAssociations = parentAssociations.filter(parent => parent.id !== parentId);
      setParentsAssociations(updatedParentAssociations);
      console.log('Registro eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
    }
  };

  const fetchParents = async () => {
    try {
      const parentList = await ParentService.getAllUsers();
      const filteredParents = parentList.filter(parent => parent.rolId === 2);
      setParents(filteredParents);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  return (
    <div className="content">
      <div className="container">
        <h1>Asociar padre</h1>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Control
            type="text"
            placeholder="Buscar..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={{ width: '400px' }}
          />
        </div>
        
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre del estudiante</th>     
              <th>Padres</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter((student) =>
                student.firstName.toLowerCase().includes(filterValue.toLowerCase())
              )
              .map((student, index) => (
                <tr key={index}>
                  <td>{student.userName}</td>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>--------</td>
                  <td>
                    <Button variant="success" onClick={() => handleAddParentModalShow(student.id)}>Agregar padre</Button>
                    <Button variant="success" onClick={() => handleManageParents(student.id)}>Gestionar padres</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        <Modal show={showAddParentModal} onHide={handleAddParentModalClose} dialogClassName="modal-xl">
          <Modal.Header closeButton>
            <Modal.Title>Asociar padre al estudiante {selectedParentStudent && (
                <small>
                <strong>
                  <span style={{ color: 'red' }}>
                    {selectedParentStudent.firstName} {selectedParentStudent.lastName}
                  </span>
                </strong>
              </small>

            )}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            
            <div className="container">

              <div>
                  <h1>Padres asociados a este estudiante</h1>
                  {loading ? (
                    <p>Cargando asociaciones de padres...</p>
                  ) : parentAssociations.length > 0 ? (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Nombre del padre</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parentAssociations.map((parent, index) => (
                          <tr key={index}>
                            <td>{parent.firstName} {parent.lastName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>Este estudiante no tiene padres asociados.</p>
                  )}
                                  
                    
              </div>


              <h1>Listado de padres</h1>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Control
                  type="text"
                  placeholder="Buscar..."
                  value={filterValueParent}
                  onChange={(e) => setFilterValueParent(e.target.value)}
                  style={{ width: '400px' }}
                />
              </div>














              {/* <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Nombre del padre</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>

                {parents
                    .filter((parent) =>
                      parent.userName.toLowerCase().includes(filterValueParent.toLowerCase())
                    )
                    .map((parent, index) => (
                      <tr key={index}>
                        <td>{parent.userName}</td>
                        <td>{parent.firstName} {parent.lastName}</td>
                        <td>{roles.length > 0 ? roles.find(role => role.rolId === parent.rolId)?.roleName : ''}</td>
                        <td>
                        <Button
                          variant="primary"
                          onClick={() => handleSelectParent(parent)}
                          style={{
                            backgroundColor: selectedParents.some(p => p.id === parent.id) ? 'red' : null
                          }}
                        >
                          {selectedParents.some(p => p.id === parent.id) ? 'Eliminar' : 'Seleccionar'}
                        </Button>

                        </td>
                      </tr>
                    ))}
              </tbody>
              </Table> */}









                {loading ? (
            <p>Cargando padres no asociados...</p>
          ) : unassociatedParents.length > 0 ? (
            
            <Table striped bordered hover>
              <thead>
                        <tr>
                          <th>Nombre del padre</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      
              {/* <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                </tr>
              </thead> */}
                  <tbody>
                  {unassociatedParents
                    .filter((parent) => {
                      const fullName = `${parent.firstName} ${parent.lastName}`.toLowerCase();
                      const searchValue = filterValueParent.toLowerCase();
                      return fullName.includes(searchValue);
                    })
                    .map((parent, index) => (
                      <tr key={index}>
                        <td>{parent.firstName} {parent.lastName}</td>
                        <td>
                          <Button
                            variant="primary"
                            onClick={() => handleSelectParent(parent)}
                            style={{
                              backgroundColor: selectedParents.some(p => p.id === parent.id) ? 'red' : null
                            }}
                          >
                            {selectedParents.some(p => p.id === parent.id) ? 'Eliminar' : 'Seleccionar'}
                          </Button>
                        </td>
                      </tr>
                    ))}

            </tbody>
          </Table>
        ) : (
      <p>No hay padres no asociados para mostrar.</p>
    )}
               
               <h1>Padres Seleccionados</h1>
                    {selectedParents.map((parent, index) => (
                      <div key={index}>
                        <p>{parent.firstName} {parent.lastName}</p>
                        <Button variant="danger" onClick={() => handleDeleteSelectedParent(parent.id)}>Eliminar</Button>
                      </div>
                    ))}
            </div>

            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddParentModalClose}>Cancelar</Button>
            <Button variant="primary" onClick={handleAddParent}>Guardar</Button>
          </Modal.Footer>
        </Modal>














        <Modal show={showParentAssociationModal} onHide={handleParentAssociationModalClose} dialogClassName="modal-xl">
  <Modal.Header closeButton>
    <Modal.Title>Asociar padre al estudiante {selectedParentStudent && `${selectedParentStudent.firstName} ${selectedParentStudent.lastName}`}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {loading ? (
      <p>Cargando asociaciones de padres...</p>
    ) : parentAssociations.length > 0 ? (
      <Table striped bordered hover>
        <thead>
          <tr>
          <th>ID del asociacion</th>
            <th>ID del padre</th>
            <th>Nombre del padre</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {parentAssociations.map((parent, index) => (
            <tr key={index}>
              <td>{parent.id}</td>
              <td>{parent.parentid}</td>
              <td>{parent.firstName} {parent.lastName}</td>
              <td><Button variant="danger" onClick={() => handleDeleteParent(parent.id)}>Eliminar</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <p>Este estudiante no tiene padres asociados.</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleParentAssociationModalClose}>Cerrar</Button>
  </Modal.Footer>
</Modal>

      </div>
    </div>
  );
};

export default ParentAssociations;
