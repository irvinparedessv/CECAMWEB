import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import StudentService from '../../services/StudentService';
import { ParentsData, Student } from '../../types';
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
    rolId: 0,
    gradeId: 1,
  });
  const [deletingStudentId, setDeletingStudentId] = useState<number | null>(null);
  const [deletingStudent, setDeletingStudent] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [updatingStudentId, setUpdatingStudentId] = useState<number | null>(null);
  const [updatingStudent, setUpdatingStudent] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const [parentsData, setParentsData] = useState<ParentsData[]>([]);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });



  useEffect(() => {
    fetchStudents();
    fetchRoles();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentList = await StudentService.getAllUsers();
      //const filteredStudents = studentList.filter(student => student.rolId === 1);
      setStudents(studentList);
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
          gradeId: 1,
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
        rolId: 0,
        gradeId: 1,
      });
    }
  };




  // const handleUpdateEnabled = async (studentId: number, newEnabledValue: boolean) => {
  //   try {
      
      
  //     // Obtener los padres con un solo hijo activo
  //     const parentData = await StudentService.getParentsWithSingleActiveChild(studentId);

  //     //SI SE PONE ESTO ANTES DE ARRUINA
  //     // Actualizar el estado del estudiante
  //     await StudentService.updateEnabled(studentId, newEnabledValue);
  
  //     // Procesar los datos de los padres (por ejemplo, mostrarlos en la consola)
  //     console.log('Padres con un solo hijo activo:', parentData);
  
  //     // Actualizar la lista de estudiantes
  //     fetchStudents();
  
  //     // Mostrar un mensaje de éxito
  //     Swal.fire(
  //       'Actualizado',
  //       'El estado del estudiante ha sido actualizado correctamente.',
  //       'success'
  //     );
  //   } catch (error) {
  //     // Manejar errores
  //     console.error('Error al actualizar el estado del estudiante:', error);
  //     Swal.fire(
  //       'Error',
  //       'Se produjo un error al actualizar el estado del estudiante.',
  //       'error'
  //     );
  //   }
  // };
  


  const handleUpdateEnabled = async (studentId: number, newEnabledValue: boolean) => {
    try {
      setUpdatingStudentId(studentId);
      setUpdatingStudent(true);
      // Obtener los datos de los padres con un solo hijo activo
      const parentsData: ParentsData[] = await StudentService.getParentsWithSingleActiveChild(studentId);

      // Construir el mensaje de confirmación
      let action = newEnabledValue ? 'activar' : 'desactivar';
      let message = `<br><b>¿Está seguro de que desea ${action} a este usuario?</b><br>`;

      // Obtener los IDs de los padres
      const parentIds = parentsData.map(parent => parent.id);

      // Si hay padres, agregar sus nombres al mensaje
      if (parentsData && parentsData.length === 1) {
        // Construir el mensaje con los nombres e IDs de los padres
        message += '\n\n<br>Tenga en cuenta que al ';
        message += newEnabledValue ? 'activar' : 'desactivar';
        message += ' al estudiante, también se  ';
        message += newEnabledValue ? 'activará' : 'desactivará';
        message += ' el siguiente padre asociado: ';
    
        parentsData.forEach((parent: ParentsData) => {
            const { padre_nombre, padre_apellido } = parent;
            message += `<span style="color: blue; text-decoration: underline;"><br><br><b>${padre_nombre} ${padre_apellido}.</b></span><br>\n`;
        });
        message += '\n<br><span style="color: orange;"><b>¿Desea continuar?</b></span></br>';
    } else if (parentsData && parentsData.length > 1) {
          // Construir el mensaje con los nombres e IDs de los padres
          // message += '\n\nLos siguientes padres también se ';
          // message += newEnabledValue ? 'activarán' : 'desactivarán';
          // message += ':\n';
          // parentsData.forEach((parent: ParentsData) => {
          //     const { padre_nombre, padre_apellido } = parent;
          //     message += `<b>${padre_nombre} ${padre_apellido}</b>\n`;
          // });
          // message += '\n¿Desea continuar?<br>';

          message += '\n\n<br>Tenga en cuenta que al ';
          message += newEnabledValue ? 'activar' : 'desactivar';
          message += ' al estudiante, también se  ';
          message += newEnabledValue ? 'activará' : 'desactivará';
          message += ' los siguientes padres asociados: <br><br>';
          
      
          parentsData.forEach((parent: ParentsData) => {
              const { padre_nombre, padre_apellido } = parent;
              message += `<span style="color: blue; text-decoration: underline;"><b>${padre_nombre} ${padre_apellido}.</b></span><br>\n`;
          });
          message += '\n<br><span style="color: orange;"><b>¿Desea continuar?</b></span></br>';
      }

      // Mostrar el Swal de confirmación
        const confirmResult = await Swal.fire({
          title: 'Advertencia',
          html: message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'Cancelar',
      });

        

        // Si el usuario confirma, actualizar el estado del estudiante
        if (confirmResult.isConfirmed) {

          //console.log('Padres a activar:', parentsData);

          if (parentsData && parentsData.length > 0) {
            //SOLO SI LA CONSULTA ME DEVUEVLE UN PADRE, EJECUTA EL METODO Y LO DESACTIVA
            await StudentService.updateParentsEnabled(studentId, parentIds, newEnabledValue);
          }
          
            



            await StudentService.updateEnabled(studentId, newEnabledValue);

            // Actualizar la lista de estudiantes
            fetchStudents();

            // Mostrar un mensaje de éxito
            Swal.fire(
                'Actualizado',
                `El estado del usuario ha sido ${newEnabledValue ? 'activado' : 'desactivado'} correctamente.`,
                'success'
            );
        } else {
            console.log('Se canceló la acción.');
        }
    } catch (error) {
        // Manejar errores
        console.error('Error al actualizar el estado del usuario:', error);
        Swal.fire(
            'Error',
            'Se produjo un error al actualizar el estado del usuario.',
            'error'
        );
    }finally {
      setUpdatingStudentId(null);
      setUpdatingStudent(false);
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
      gradeId: 1,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    let errorMessage = '';

    // Validación de nombres y apellidos: permitir solo letras y espacios
    if (name === 'firstName' || name === 'lastName') {
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/;
      if (value !== "" && !regex.test(value)) {
        newValue = newStudentData[name]; // Mantener el valor actual
        errorMessage = 'Solo se permiten letras y espacios.';
      }
    }

    if (name === 'email') {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (value !== "" && !emailRegex.test(value)) {
        errorMessage = 'Ingrese un correo electrónico válido.';
      }
    }
    
    setNewStudentData(prevState => {
      const updatedData = {
        ...prevState,
        [name]: newValue,
      };
      
      // Generar nombre de usuario si se actualiza el nombre o apellido
      if (name === 'firstName' || name === 'lastName') {
        updatedData.userName = generateUserName(updatedData.firstName, updatedData.lastName);
      }
  
      return updatedData;
    });

     if (name === 'email') {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (value !== "" && !emailRegex.test(value)) {
      errorMessage = 'Ingrese un correo electrónico válido.';
    }
  }
  
    // Actualizar estado de errores
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: errorMessage
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewStudentData(prevState => ({
      ...prevState,
      rolId: parseInt(value),
    }));
  };

  const handleAddStudent = async () => {
    try {
      // Verificar campos obligatorios
      if (!newStudentData.firstName || !newStudentData.lastName || !newStudentData.email) {
        return Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      }
      
      // Verificar si el correo ya existe
      const emailExists = await StudentService.checkEmailExists(newStudentData.email);
      if (emailExists) {
        return Swal.fire('Error', 'El correo ya existe.', 'error');
      }

      // Guardar el estudiante
      await StudentService.insertUser(newStudentData);
      setShowAddModal(false);
      fetchStudents();
  
      // Mostrar una alerta de éxito
      Swal.fire('Éxito', 'El usuario ha sido agregado correctamente.', 'success');
    } catch (error) {
      console.error('Error al insertar usuario:', error);
      Swal.fire('Error', 'Se produjo un error al intentar agregar el usuario.', 'error');
    }
  };

  const handleUpdateStudent = async () => {
    try {
      // Verificar campos obligatorios
      if (!newStudentData.firstName || !newStudentData.lastName || !newStudentData.email) {
        return Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      }
      
      // Verificar que selectedStudentId no sea null
      if (selectedStudentId === null) {
        return Swal.fire('Error', 'No se ha seleccionado un usuario para actualizar.', 'error');
      }
  
      // Obtener el usuario actual para comparar el correo
      const currentStudentData = await StudentService.getUser(selectedStudentId);
  
      // Solo verificar la existencia del correo si ha sido modificado
      if (newStudentData.email !== currentStudentData.email) {
        const emailExists = await StudentService.checkEmailExists(newStudentData.email);
        if (emailExists) {
          return Swal.fire('Error', 'El correo ya existe.', 'error');
        }
      }

      // Actualizar el padre
      if (selectedStudentId !== null) {
        await StudentService.updateUser(selectedStudentId, newStudentData);
        setShowAddModal(false);
        fetchStudents();

        // Mostrar una alerta de éxito
        Swal.fire('Éxito', 'Los cambios han sido guardados correctamente.', 'success');
      }
        
      
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      Swal.fire('Error', 'Se produjo un error al intentar guardar los cambios.', 'error');
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
        text: 'Esta acción eliminará el usuario asociado.',
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


  const handleRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
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
        <h1>Usuarios</h1>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Control
            type="text"
            placeholder="Buscar..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={{ width: '400px' }}
          />
           <select value={selectedRole} onChange={handleRole}>
            <option value="">Todos los roles</option>
            {roles.map((role, index) => (
              <option key={index} value={role.rolId}>{role.roleName}</option>
            ))}
          </select>
          <Button variant="primary" onClick={() => handleAddModalShow(null)}>Agregar Usuario</Button>
        </div>
        
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {students
  .filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const searchValue = filterValue.toLowerCase();
    const roleMatch = selectedRole !== '' ? student.rolId === parseInt(selectedRole) : true;

    return fullName.includes(searchValue) && roleMatch;
  })
  .map((student, index) => {
    const studentRole = roles.find(role => role.rolId === student.rolId);
    const roleName = studentRole ? studentRole.roleName : 'Unknown'; // Manejar caso donde no se encuentre el rol
    return (
      <tr key={index}>
      <td>{student.userName}</td>
      <td>{student.email}</td>
      <td>{student.firstName} {student.lastName}</td>
      <td>{student.enabled ? 'Activo' : 'Inactivo'}</td>
      <td>{roleName}</td>
        <td>
        <Button
            variant="secondary"
            onClick={() => handleUpdateEnabled(student.id, !student.enabled)}
            disabled={updatingStudentId === student.id}
          >
            {updatingStudentId === student.id && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{ marginRight: '5px' }}
              />
            )}
            {updatingStudentId === student.id ? 'Actualizando...' : (student.enabled ? 'Desactivar' : 'Activar')}
          </Button>
        {/* <Button
          variant="secondary"
          onClick={() => handleUpdateEnabled(student.id, !student.enabled)}
        >
          {student.enabled ? 'Desactivar' : 'Activar'}
        </Button> */}
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
        <Button
          variant="primary"
          onClick={() => handleAddModalShow(student.id)}
        >
          Editar
        </Button>
      </td>
    </tr>
  )})}

          </tbody>
        </Table>

        <Modal show={showAddModal} onHide={handleAddModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedStudentId !== null ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
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
                {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
              </Form.Group>

              {/* <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={newStudentData.password} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formUserName">
                <Form.Label>Usuario</Form.Label>
                <Form.Control type="text" name="userName" disabled={true} value={newStudentData.userName} onChange={handleInputChange} />
              </Form.Group> */}
              {/* <Form.Group controlId="formEnabled">
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
              </Form.Group> */}
              <Form.Group controlId="formRoleId">
                <Form.Label>Rol</Form.Label>
                <Form.Control as="select" name="rolId" value={newStudentData.rolId} onChange={handleRoleChange}>
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
