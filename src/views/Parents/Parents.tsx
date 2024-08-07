import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import ParentService from "../../services/ParentService";
import { Parent } from "../../types/Parent";
import { Rol } from "../../types/Rol";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";
import { itemsPerPage } from "../../const/Pagination";
import StudentService from "../../services/StudentService";

const Parents = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [newParentData, setNewParentData] = useState<Parent>({
    id: 0,
    userName: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    enabled: true,
    rolId: 2,
  });
  const [filterValue, setFilterValue] = useState("");

  const [deletingParentId, setDeletingParentId] = useState<number | null>(null);
  const [deletingParent, setDeletingParent] = useState(false);
  const [updatingParentId, setUpdatingParentId] = useState<number | null>(null);
  const [updatingParent, setUpdatingParent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    fetchParents();
    fetchRoles();
  }, [currentPage, filterValue]);

  const fetchParents = async () => {
    try {
      const params = {
        page: currentPage,
        size: itemsPerPage,
        filter: filterValue,
        rolId: 2,
      };
      const response = await StudentService.getAllUsers(params);
      setParents(response.data);
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
      const roleList = await ParentService.getAllRols();
      setRoles(roleList);
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };

  const handleAddModalShow = (parentId: number | null) => {
    setSelectedParentId(parentId);
    setShowAddModal(true);

    if (parentId !== null) {
      const selectedParent = parents.find((parent) => parent.id === parentId);
      if (selectedParent) {
        setNewParentData({
          id: selectedParent.id,
          userName: selectedParent.userName,
          email: selectedParent.email,
          password: "", // Debes decidir si permitir editar la contraseña
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
        userName: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
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
      userName: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      enabled: true,
      rolId: 2,
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
        newValue = newParentData[name]; // Mantener el valor actual
        errorMessage = "Solo se permiten letras y espacios.";
      }
    }

     // Validación y conversión a minúsculas para el correo electrónico
     if (name === 'email') {
      newValue = value.toLowerCase(); // Convertir a minúsculas
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      if (newValue !== "" && !emailRegex.test(newValue)) {
        errorMessage = "Ingrese un correo electrónico válido.";
      }
    }

    setNewParentData((prevState) => {
      const updatedData = {
        ...prevState,
        [name]: newValue,
      };

      // Generar nombre de usuario si se actualiza el nombre o apellido
      // if (name === "firstName" || name === "lastName") {
      //   updatedData.userName = generateUserName(
      //     updatedData.firstName,
      //     updatedData.lastName
      //   );
      // }

      return updatedData;
    });

    // Actualizar estado de errores
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    if (selectedParentId !== null) {
      await handleUpdateParent();
    } else {
      await handleAddParent();
    }
    setIsSubmitting(false);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setNewParentData((prevState) => ({
      ...prevState,
      rolId: parseInt(value),
    }));
  };

 const handleAddParent = async () => {
    try {
      // Verificar campos obligatorios
      if (
        !newParentData.firstName ||
        !newParentData.lastName ||
        !newParentData.email
      ) {
        return Swal.fire(
          "Error",
          "Por favor, complete todos los campos obligatorios.",
          "error"
        );
      }
  
      // Mostrar Swal de carga
      Swal.fire({
        title: 'Guardando padre...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      // Verificar si el correo ya existe
      const emailExists = await ParentService.checkEmailExists(
        newParentData.email
      );
      if (emailExists) {
        Swal.close();
        return Swal.fire("Error", "El correo ya existe.", "error");
      }
  
      // Guardar el estudiante
      await ParentService.insertUser(newParentData);
      setShowAddModal(false);
      fetchParents();
  
      // Cerrar Swal de carga y mostrar una alerta de éxito
      Swal.close();
      Swal.fire(
        "Éxito",
        "El padre ha sido agregado correctamente.",
        "success"
      );
    } catch (error) {
      console.error("Error al insertar padre:", error);
  
      // Cerrar Swal de carga y mostrar una alerta de error
      Swal.close();
      Swal.fire(
        "Error",
        "Se produjo un error al intentar agregar el padre.",
        "error"
      );
    }
  };

  const handleUpdateParent = async () => {
    try {
      // Verificar campos obligatorios
      if (
        !newParentData.firstName ||
        !newParentData.lastName ||
        !newParentData.email
      ) {
        return Swal.fire(
          "Error",
          "Por favor, complete todos los campos obligatorios.",
          "error"
        );
      }

      if (selectedParentId === null) {
        return Swal.fire(
          "Error",
          "No se ha seleccionado un estudiante para actualizar.",
          "error"
        );
      }

      // Obtener el usuario actual para comparar el correo
      const currentParentData = await ParentService.getUser(selectedParentId);

      // Solo verificar la existencia del correo si ha sido modificado
      if (newParentData.email !== currentParentData.email) {
        const emailExists = await ParentService.checkEmailExists(
          newParentData.email
        );
        if (emailExists) {
          return Swal.fire("Error", "El correo ya existe.", "error");
        }
      }

      // Actualizar el padre
      if (selectedParentId !== null) {
        await ParentService.updateUser(selectedParentId, newParentData);
        setShowAddModal(false);
        fetchParents();

        // Mostrar una alerta de éxito
        Swal.fire(
          "Éxito",
          "Los cambios han sido guardados correctamente.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al actualizar padre:", error);
      Swal.fire(
        "Error",
        "Se produjo un error al intentar guardar los cambios.",
        "error"
      );
    }
  };

  // const handleDeleteParent = async (parentId: number) => {
  //   try {

  //   } catch (error) {
  //     console.error('Error al eliminar padre:', error);
  //   }
  // };

  const handleDeleteParent = async (parent: Parent) => {
    try {
      setDeletingParentId(parent.id);
      setDeletingParent(true);

      // Mostrar la alerta de confirmación
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el padre asociado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
      });

      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        // Realizar la solicitud para eliminar el registro utilizando el servicio
        await ParentService.deleteUser(parent.id);
        fetchParents();

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
      setDeletingParentId(null);
      setDeletingParent(false);
    }
  };

  const handleUpdateEnabled = async (
    parentId: number,
    newEnabledValue: boolean
  ) => {
    try {
      setUpdatingParentId(parentId);
      setUpdatingParent(true);
      // Obtener los datos de los padres con un solo hijo activo

      // Mostrar el Swal de confirmación
      const confirmResult = await Swal.fire({
        title: "Advertencia",
        text: "¿Está seguro de que desea desactivar a este padre?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });

      // Si el usuario confirma, actualizar el estado del estudiante
      if (confirmResult.isConfirmed) {
        await ParentService.updateEnabled(parentId, newEnabledValue);

        // Actualizar la lista de estudiantes
        fetchParents();

        // Mostrar un mensaje de éxito
        Swal.fire(
          "Actualizado",
          `El estado del estudiante ha sido ${newEnabledValue ? "activado" : "desactivado"} correctamente.`,
          "success"
        );
      } else {
        console.log("Se canceló la acción.");
      }
    } catch (error) {
      // Manejar errores
      console.error("Error al actualizar el estado del estudiante:", error);
      Swal.fire(
        "Error",
        "Se produjo un error al actualizar el estado del estudiante.",
        "error"
      );
    } finally {
      setUpdatingParentId(null);
      setUpdatingParent(false);
    }
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
            style={{ width: "400px" }}
          />
          <Button variant="primary" onClick={() => handleAddModalShow(null)}>
            Agregar Padre
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Nombre del padre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {parents
              .filter((parent) => {
                const fullName =
                  `${parent.firstName} ${parent.lastName}`.toLowerCase();
                const searchValue = filterValue.toLowerCase();
                return fullName.includes(searchValue);
              })
              .map((parent, index) => (
                <tr key={index}>
                  <td>{parent.userName}</td>
                  <td>{parent.email}</td>
                  <td>
                    {parent.firstName} {parent.lastName}
                  </td>
                  <td>{parent.enabled ? "Activo" : "Inactivo"}</td>
                  <td>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleUpdateEnabled(parent.id, !parent.enabled)
                      }
                      disabled={updatingParentId === parent.id}
                    >
                      {updatingParentId === parent.id && (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          style={{ marginRight: "5px" }}
                        />
                      )}
                      {updatingParentId === parent.id
                        ? "Actualizando..."
                        : parent.enabled
                          ? "Desactivar"
                          : "Activar"}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteParent(parent)}
                      disabled={deletingParentId === parent.id}
                    >
                      {deletingParentId === parent.id && (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          style={{ marginRight: "5px" }}
                        />
                      )}
                      {deletingParentId === parent.id
                        ? "Eliminando..."
                        : "Eliminar"}
                    </Button>
                    {/* <Button variant="danger" className="mr-2" onClick={() => handleDeleteParent(parent.id)}>Eliminar</Button> */}
                    <Button
                      variant="primary"
                      onClick={() => handleAddModalShow(parent.id)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
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
              {selectedParentId !== null ? "Editar Padre" : "Agregar Padre"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>Nombres</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={newParentData.firstName}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={newParentData.lastName}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={newParentData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <Form.Text className="text-danger">{errors.email}</Form.Text>
                )}
              </Form.Group>
              {/* <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={newParentData.password} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formUserName">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  disabled={true}
                  value={(newParentData.userName || '')}
                  onChange={handleInputChange}
                />
              </Form.Group> */}
              <Form.Group controlId="formRoleId">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  as="select"
                  disabled={true}
                  name="rolId"
                  value={newParentData.rolId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleRoleChange
                  }
                >
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
           
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSubmitting}
            >
          {selectedParentId !== null ? 'Guardar Cambios' : 'Agregar'}
        </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Parents;