import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Pagination, Card } from "react-bootstrap";
import StudentService from "../../services/StudentService";
import { ParentsData, Student } from "../../types";
import { Rol } from "../../types/Rol";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";
import { itemsPerPage } from "../../const/Pagination";
import { UserInformation } from '../../types/Login';
import URL_STORAGE from '../../services/imageConfig';

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [newStudentData, setNewStudentData] = useState<Student>({
    id: 0,
    userName: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    enabled: true,
    userPhoto: '',
    rolId: 0,
    gradeId: 1,
  });
  const [deletingStudentId, setDeletingStudentId] = useState<number | null>(
    null
  );
  const [deletingStudent, setDeletingStudent] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [updatingStudentId, setUpdatingStudentId] = useState<number | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false); // Agregar estado isLoading
  const [isHovered, setIsHovered] = useState(false);
  const [userPhotoUrl, setUserPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BASE_URL = URL_STORAGE;


  const [updatingStudent, setUpdatingStudent] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [parentsData, setParentsData] = useState<ParentsData[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    fetchStudents();
    fetchRoles();
  }, [currentPage, selectedRole, filterValue]);

  const fetchStudents = async () => {
    try {
      const params = {
        page: currentPage,
        size: itemsPerPage,
        filter: filterValue, // Ajusta según cómo se manejen los filtros en tu API
        rolId: selectedRole, // Ajusta según cómo se manejen los roles en tu API
      };
      console.log(params);
      const response = await StudentService.getAllUsers(params);
      console.log(response);
      setStudents(response.data);
      setTotalPages(response.last_page);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };
  const handlePageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const fetchRoles = async () => {
    try {
      const roleList = await StudentService.getAllRols();
      setRoles(roleList);
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };

  const handleAddModalShow = (studentId: number | null) => {
    setSelectedStudentId(studentId);
    setShowAddModal(true);

    if (studentId !== null) {
      const selectedStudent = students.find(
        (student) => student.id === studentId
      );
      if (selectedStudent) {
        setNewStudentData({
          id: selectedStudent.id,
          userName: selectedStudent.userName,
          email: selectedStudent.email,
          password: "",
          firstName: selectedStudent.firstName,
          lastName: selectedStudent.lastName,
          enabled: selectedStudent.enabled,
          userPhoto: selectedStudent.userPhoto,
          rolId: selectedStudent.rolId,
          gradeId: 1,
        });
      }
    } else {
      setNewStudentData({
        id: 0,
        userName: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        enabled: true,
        userPhoto: '',
        rolId: 0,
        gradeId: 1,
      });
    }
  };

  
  const handleAddPhoto = (studentId: number) => {
    setSelectedStudentId(studentId);
    setShowAddPhotoModal(true);
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
          userPhoto: selectedStudent.userPhoto ? `${BASE_URL}${selectedStudent.userPhoto}` : DEFAULT_USER_PHOTO_URL,
          rolId: selectedStudent.rolId,
          gradeId: 1,
        });
      }
    } 

    // const getFullPhotoUrl = (photoPath) => {
    //   return photoPath ? `${BASE_URL}${photoPath}` : DEFAULT_USER_PHOTO_URL;
    // };


  };

  const handleAddPhotoClose = () => {
    setShowAddPhotoModal(false);
    setPhoto(null);
  };

  const [photo, setPhoto] = useState<File | null>(null);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Obtenemos el primer archivo seleccionado
    if (file) {
      const reader = new FileReader(); // Creamos un lector de archivos
      reader.onloadend = async () => {
        // Verificamos que reader.result sea un string
        if (typeof reader.result === 'string') {
          setUserPhotoUrl(reader.result); // Actualizamos userPhotoUrl con la URL base64 de la imagen
        } else {
          // Manejo de error o conversión si result es ArrayBuffer
          const arrayBuffer: ArrayBuffer = reader.result as ArrayBuffer;
          const converted = arrayBufferToBase64(arrayBuffer); // Función para convertir ArrayBuffer a base64
          setUserPhotoUrl(converted);
        }

        // Subir la foto al servidor
        const formData = new FormData();
        formData.append('photo', file);
        try {
          setIsLoading(true);
          // Llama al servicio para subir la foto del usuario seleccionado
          await StudentService.uploadPhoto(selectedStudentId, formData);
          fetchStudents(); // Actualiza la lista de estudiantes después de subir la foto
          // Actualiza la URL de la foto mostrada
          setUserPhotoUrl(`URL de la foto subida`); // Deberías obtener la URL real desde la respuesta del servidor
          setShowAddPhotoModal(false); // Cierra el modal después de subir la foto
          Swal.fire('Éxito', 'Foto subida correctamente.', 'success');
        } catch (error) {
          Swal.fire('Error', 'Error al subir la foto.', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file); // Leemos el archivo como URL base64
    }
  };

  // Función de utilidad para convertir ArrayBuffer a base64
  const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer): string => {
    const base64String = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/jpeg;base64,${base64String}`;
  };





  // if (userInfo === null) {
  //   return null;
  // }

  // const { firstName, lastName, userName, rolId, userPhoto, email } = userInfo;
  const DEFAULT_USER_PHOTO_URL = URL_STORAGE+'userPhoto/default-user-photo.jpg';
  //const userPhotoUrl =  DEFAULT_USER_PHOTO_URL;



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

  const handleUpdateEnabled = async (
    studentId: number,
    newEnabledValue: boolean
  ) => {
    try {
      setUpdatingStudentId(studentId);
      setUpdatingStudent(true);
      // Obtener los datos de los padres con un solo hijo activo
      const parentsData: ParentsData[] =
        await StudentService.getParentsWithSingleActiveChild(studentId);

      // Construir el mensaje de confirmación
      let action = newEnabledValue ? "activar" : "desactivar";
      let message = `<br><b>¿Está seguro de que desea ${action} a este usuario?</b><br>`;

      // Obtener los IDs de los padres
      const parentIds = parentsData.map((parent) => parent.id);

      // Si hay padres, agregar sus nombres al mensaje
      if (parentsData && parentsData.length === 1) {
        // Construir el mensaje con los nombres e IDs de los padres
        message += "\n\n<br>Tenga en cuenta que al ";
        message += newEnabledValue ? "activar" : "desactivar";
        message += " al estudiante, también se  ";
        message += newEnabledValue ? "activará" : "desactivará";
        message += " el siguiente padre asociado: ";

        parentsData.forEach((parent: ParentsData) => {
          const { padre_nombre, padre_apellido } = parent;
          message += `<span style="color: blue; text-decoration: underline;"><br><br><b>${padre_nombre} ${padre_apellido}.</b></span><br>\n`;
        });
        message +=
          '\n<br><span style="color: orange;"><b>¿Desea continuar?</b></span></br>';
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

        message += "\n\n<br>Tenga en cuenta que al ";
        message += newEnabledValue ? "activar" : "desactivar";
        message += " al estudiante, también se  ";
        message += newEnabledValue ? "activará" : "desactivará";
        message += " los siguientes padres asociados: <br><br>";

        parentsData.forEach((parent: ParentsData) => {
          const { padre_nombre, padre_apellido } = parent;
          message += `<span style="color: blue; text-decoration: underline;"><b>${padre_nombre} ${padre_apellido}.</b></span><br>\n`;
        });
        message +=
          '\n<br><span style="color: orange;"><b>¿Desea continuar?</b></span></br>';
      }

      // Mostrar el Swal de confirmación
      const confirmResult = await Swal.fire({
        title: "Advertencia",
        html: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });

      // Si el usuario confirma, actualizar el estado del estudiante
      if (confirmResult.isConfirmed) {
        //console.log('Padres a activar:', parentsData);

        if (parentsData && parentsData.length > 0) {
          //SOLO SI LA CONSULTA ME DEVUEVLE UN PADRE, EJECUTA EL METODO Y LO DESACTIVA
          await StudentService.updateParentsEnabled(
            studentId,
            parentIds,
            newEnabledValue
          );
        }

        await StudentService.updateEnabled(studentId, newEnabledValue);

        // Actualizar la lista de estudiantes
        fetchStudents();

        // Mostrar un mensaje de éxito
        Swal.fire(
          "Actualizado",
          `El estado del usuario ha sido ${newEnabledValue ? "activado" : "desactivado"} correctamente.`,
          "success"
        );
      } else {
        console.log("Se canceló la acción.");
      }
    } catch (error) {
      // Manejar errores
      console.error("Error al actualizar el estado del usuario:", error);
      Swal.fire(
        "Error",
        "Se produjo un error al actualizar el estado del usuario.",
        "error"
      );
    } finally {
      setUpdatingStudentId(null);
      setUpdatingStudent(false);
    }
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    setSelectedStudentId(null);
    setNewStudentData({
      id: 0,
      userName: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      enabled: true,
      userPhoto: '',
      rolId: 1,
      gradeId: 1,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    let errorMessage = "";

    // Validación de nombres y apellidos: permitir solo letras y espacios
    if (name === "firstName" || name === "lastName") {
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/;
      if (value !== "" && !regex.test(value)) {
        newValue = newStudentData[name]; // Mantener el valor actual
        errorMessage = "Solo se permiten letras y espacios.";
      }
    }

    if (name === 'email') {
      newValue = value.toLowerCase(); // Convertir a minúsculas
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      if (newValue !== "" && !emailRegex.test(newValue)) {
        errorMessage = "Ingrese un correo electrónico válido.";
      }
    }

    setNewStudentData((prevState) => {
      const updatedData = {
        ...prevState,
        [name]: newValue,
      };

      // Generar nombre de usuario si se actualiza el nombre o apellido
      

      return updatedData;
    });

    

    // Actualizar estado de errores
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleSave = async () => {
    if (Object.values(errors).some(error => error !== '')) {
      alert("Por favor, corrija los errores antes de guardar.");
      return;
    }

    setIsSubmitting(true);
    if (selectedStudentId !== null) {
      await handleUpdateStudent();
    } else {
      await handleAddStudent();
    }
    setIsSubmitting(false);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewStudentData((prevState) => ({
      ...prevState,
      rolId: parseInt(value),
    }));
  };

  const handleAddStudent = async () => {
    try {
      // Verificar campos obligatorios
      if (
        !newStudentData.firstName ||
        !newStudentData.lastName ||
        !newStudentData.email
      ) {
        return Swal.fire(
          "Error",
          "Por favor, complete todos los campos obligatorios.",
          "error"
        );
      }

      // Verificar si el correo ya existe
      const emailExists = await StudentService.checkEmailExists(
        newStudentData.email
      );
      if (emailExists) {
        return Swal.fire("Error", "El correo ya existe.", "error");
      }

      // Guardar el estudiante
      await StudentService.insertUser(newStudentData);
      setShowAddModal(false);
      fetchStudents();

      // Mostrar una alerta de éxito
      Swal.fire(
        "Éxito",
        "El usuario ha sido agregado correctamente.",
        "success"
      );
    } catch (error) {
      console.error("Error al insertar usuario:", error);
      Swal.fire(
        "Error",
        "Se produjo un error al intentar agregar el usuario.",
        "error"
      );
    }
  };

  const handleUpdateStudent = async () => {
    try {
      // Verificar campos obligatorios
      if (
        !newStudentData.firstName ||
        !newStudentData.lastName ||
        !newStudentData.email
      ) {
        return Swal.fire(
          "Error",
          "Por favor, complete todos los campos obligatorios.",
          "error"
        );
      }

      // Verificar que selectedStudentId no sea null
      if (selectedStudentId === null) {
        return Swal.fire(
          "Error",
          "No se ha seleccionado un usuario para actualizar.",
          "error"
        );
      }

      // Obtener el usuario actual para comparar el correo
      const currentStudentData =
        await StudentService.getUser(selectedStudentId);

      // Solo verificar la existencia del correo si ha sido modificado
      if (newStudentData.email !== currentStudentData.email) {
        const emailExists = await StudentService.checkEmailExists(
          newStudentData.email
        );
        if (emailExists) {
          return Swal.fire("Error", "El correo ya existe.", "error");
        }
      }

      // Actualizar el padre
      if (selectedStudentId !== null) {
        await StudentService.updateUser(selectedStudentId, newStudentData);
        setShowAddModal(false);
        fetchStudents();

        // Mostrar una alerta de éxito
        Swal.fire(
          "Éxito",
          "Los cambios han sido guardados correctamente.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      Swal.fire(
        "Error",
        "Se produjo un error al intentar guardar los cambios.",
        "error"
      );
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
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el usuario asociado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
      });

      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        // Realizar la solicitud para eliminar el registro utilizando el servicio
        await StudentService.deleteUser(student.id);
        fetchStudents();

        // Mostrar una alerta de éxito después de que se complete la eliminación
        Swal.fire(
          "Eliminado",
          "El padre asociado ha sido eliminado correctamente.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
      // Mostrar una alerta de error si ocurre algún problema durante la eliminación
      Swal.fire(
        "Error",
        "Se produjo un error al eliminar el padre asociado.",
        "error"
      );
    } finally {
      setDeletingStudentId(null);
      setDeletingStudent(false);
    }
  };

  const handleRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
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
            style={{ width: "400px" }}
          />
          <select value={selectedRole} onChange={handleRole}>
            <option value="">Todos los roles</option>
            {roles.map((role, index) => (
              <option key={index} value={role.rolId}>
                {role.roleName}
              </option>
            ))}
          </select>
          <Button variant="primary" onClick={() => handleAddModalShow(null)}>
            Agregar Usuario
          </Button>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Foto</th>
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
                const fullName =
                  `${student.firstName} ${student.lastName}`.toLowerCase();
                return fullName;
              })
              .map((student, index) => {
                const studentRole = roles.find(
                  (role) => role.rolId === student.rolId
                );
                const roleName = studentRole ? studentRole.roleName : "Unknown"; // Manejar caso donde no se encuentre el rol
                return (
                  <tr key={index}>
                    <td>
                      <img src={student.userPhoto==null ? DEFAULT_USER_PHOTO_URL : `${BASE_URL}${student.userPhoto}` } alt={student.userPhoto} style={{ width: '50px', height: '50px' }} />
                    </td>
                    <td>{student.userName}</td>
                    <td>{student.email}</td>
                    <td>
                      {student.firstName} {student.lastName}
                    </td>
                    <td>{student.enabled ? "Activo" : "Inactivo"}</td>
                    <td>{roleName}</td>
                    <td>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          handleUpdateEnabled(student.id, !student.enabled)
                        }
                        disabled={updatingStudentId === student.id}
                      >
                        {updatingStudentId === student.id && (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ marginRight: "5px" }}
                          />
                        )}
                        {updatingStudentId === student.id
                          ? "Actualizando..."
                          : student.enabled
                            ? "Desactivar"
                            : "Activar"}
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
                            style={{ marginRight: "5px" }}
                          />
                        )}
                        {deletingStudentId === student.id
                          ? "Eliminando..."
                          : "Eliminar"}
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleAddModalShow(student.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => handleAddPhoto(student.id)}
                      >
                        Agregar Foto
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        <Pagination>
          {[...Array(totalPages)].map((_, pageIndex) => (
            <Pagination.Item
              key={pageIndex + 1}
              active={pageIndex + 1 === currentPage}
              onClick={() => handlePageChange(pageIndex + 1)}
            >
              {pageIndex + 1}
            </Pagination.Item>
          ))}
        </Pagination>
        <Modal show={showAddModal} onHide={handleAddModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedStudentId !== null
                ? "Editar Usuario"
                : "Agregar Usuario"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>Nombres</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={newStudentData.firstName}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={newStudentData.lastName}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={newStudentData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <Form.Text className="text-danger">{errors.email}</Form.Text>
                )}
              </Form.Group>

              
              <Form.Group controlId="formRoleId">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  as="select"
                  name="rolId"
                  value={newStudentData.rolId}
                  onChange={handleRoleChange}
                >
                  {/* <Form.Control as="select" name="rolId"  value={newStudentData.rolId}> */}
                  <option value="">Seleccionar Rol</option>
                  {roles.map((role, index) => (
                    <option key={index} value={role.rolId}>
                      {role.roleName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddModalClose} disabled={isSubmitting}>Cancelar</Button>
              {/* <Button variant="primary" onClick={selectedStudentId !== null ? handleUpdateStudent : handleAddStudent}>
                {selectedStudentId !== null ? 'Guardar Cambios' : 'Agregar'}
              </Button>
              </Button> */}
              <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting || Object.values(errors).some(error => error !== '')}
          >
            {selectedStudentId !== null ? 'Guardar Cambios' : 'Agregar'}
          </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showAddPhotoModal} onHide={handleAddPhotoClose}>
  <Modal.Header closeButton>
    <Modal.Title>
      Gestionar foto para el usuario: <span style={{ color: 'red', fontWeight: 'bold' }}>
         {newStudentData.firstName} {newStudentData.lastName}
      </span>
  </Modal.Title>

  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="formPhoto">
        <Card.Body>
          <div className="text-center mb-3 position-relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <label htmlFor="photoInput">
            {/* <img src={newStudentData.userPhoto==null ? DEFAULT_USER_PHOTO_URL :newStudentData.userPhoto} alt={newStudentData.userPhoto==null ? DEFAULT_USER_PHOTO_URL :newStudentData.userPhoto} style={{ width: '50px', height: 'auto' }} /> */}

              <img src={newStudentData.userPhoto==null ? DEFAULT_USER_PHOTO_URL :newStudentData.userPhoto}  alt={newStudentData.userPhoto==null ? DEFAULT_USER_PHOTO_URL :newStudentData.userPhoto} className={`rounded-circle img-fluid ${isHovered ? 'blur' : ''}`} />
              {isHovered && <p className="change-photo-message">Cambiar Foto</p>}
              <input type="file" id="photoInput" accept=".jpeg,.jpg,.png" onChange={handlePhotoChange} style={{ display: 'none' }} />
            </label>
          </div>
        </Card.Body>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleAddPhotoClose}>Cancelar</Button>
    {/* <Button variant="primary" onClick={handleUploadPhoto}>Subir Foto</Button> */}
  </Modal.Footer>
</Modal>
      </div>
    </div>
  );
};

export default Students;