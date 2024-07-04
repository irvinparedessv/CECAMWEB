import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import StudentService from "../../services/StudentService";
import ParentService from "../../services/ParentService";
import { ParentsAssociationNames } from "../../types";
import { Rol } from "../../types/Rol";
import { Parent } from "../../types/Parent";
import { ParentAssociation } from "../../types";
import ParentAssociationService from "../../services/ParentAssociationService";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";
import { itemsPerPage } from "../../const/Pagination";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const ParentAssociations = () => {
  // const [students, setStudents] = useState<Student[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);

  const [filterValue, setFilterValue] = useState("");
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  // const [showParentAssociationModal, setShowParentAssociationModal] = useState(false);

  const [selectedParentStudent, setSelectedParentStudent] =
    useState<ParentsAssociationNames | null>(null);

  const [parents, setParents] = useState<Parent[]>([]);
  const [parentAssociations, setParentsAssociations] = useState<
    ParentAssociation[]
  >([]);
  const [filterValueParent, setFilterValueParent] = useState("");
  //const [selectedParents, setSelectedParents] = useState<ParentAssociation[]>([]);
  const [loading, setLoading] = useState(false);
  const [unassociatedParents, setUnassociatedParents] = useState<
    ParentAssociation[]
  >([]);

  // Estado para almacenar los padres seleccionados
  const [selectedParents, setSelectedParents] = useState<ParentAssociation[]>(
    []
  );

  const [parentsAssociationNames, setParentsAssociationNames] = useState<
    ParentsAssociationNames[]
  >([]);

  const [deletingParentId, setDeletingParentId] = useState<number | null>(null);
  const [deletingParent, setDeletingParent] = useState(false);

  const [selectingParentId, setSelectingParentId] = useState<number | null>(
    null
  );
  const [selectingParent, setSelectingParent] = useState(false);
  const [totalPagesMain, setTotalPagesMain] = useState(0);

  const [allItems, setAllItems] = useState([]);

  // Define el estado para el número de página actual
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageMain, setCurrentPageMain] = useState(1);

  // // Define la cantidad de elementos por página
  // const itemsPerPage = 3;
  // Calcula el índice del primer elemento en la página actual
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  // Calcula el índice del último elemento en la página actual
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  // Obtiene los elementos de la página actual
  const currentItems = unassociatedParents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula el número total de páginas
  const totalPages = Math.ceil(unassociatedParents.length / itemsPerPage);

  // Calcula la lista de números de página
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Modifica la función para cambiar a la página anterior
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Modifica la función para cambiar a la página siguiente
  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Modifica la función para cambiar a una página específica
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };
  const handlePageChange = async (pageNumber: number) => {
    setCurrentPageMain(pageNumber);
  };
  // Renderiza los números de página como botones
  const renderPageNumbers = pageNumbers.map((number) => (
    <Button
      key={number}
      onClick={() => goToPage(number)}
      disabled={currentPage === number}
    >
      {number}
    </Button>
  ));

  const handleSelectParent = async (parent: ParentAssociation) => {
    if (!selectedParentStudent) {
      console.error("No se ha seleccionado ningún estudiante.");
      return;
    }

    try {
      setSelectingParentId(parent.id);
      setSelectingParent(true);

      // Mostrar la alerta de confirmación
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción seleccionará el padre asociado.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, seleccionar",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
      });

      // Si el usuario confirma la selección
      if (result.isConfirmed) {
        // Ocultar el botón de cancelar después de que el usuario confirme la selección
        const cancelButton = Swal.getCancelButton();
        if (cancelButton) {
          cancelButton.style.display = "none";
        }

        // Realizar la selección del padre
        await saveSelectedParent(selectedParentStudent.id, parent.id);

        // Actualizar la lista de padres asociados
        const updatedParentAssociations =
          await ParentAssociationService.getUsersWithParentAssociations(
            selectedParentStudent.id
          );
        setParentsAssociations(updatedParentAssociations);

        // Actualizar la lista de padres no asociados
        await fetchUnassociatedParents(selectedParentStudent.id);
        await fetchStudents();

        // Mostrar una alerta de éxito después de seleccionar el padre
        await Swal.fire({
          title: "¡Seleccionado!",
          text: "El padre asociado ha sido seleccionado correctamente.",
          icon: "success",
          allowOutsideClick: false,
        });
      }
    } catch (error) {
      console.error("Error al seleccionar el padre:", error);
      // Mostrar una alerta de error si ocurre algún problema durante la selección
      Swal.fire(
        "Error",
        "Se produjo un error al seleccionar el padre asociado.",
        "error"
      );
    } finally {
      // Restablecer el estado después de que se complete la operación
      setSelectingParentId(null);
      setSelectingParent(false);
    }
  };

  // Función para enviar la solicitud y guardar el padre seleccionado en la base de datos
  const saveSelectedParent = async (studentId: number, parentId: number) => {
    try {
      // Aquí debes enviar la solicitud para guardar el padre asociado al estudiante
      await ParentAssociationService.saveParentAssociations(
        studentId,
        parentId
      );
      console.log("Padre asociado guardado correctamente");
    } catch (error) {
      console.error("Error al guardar el padre asociado:", error);
    }
  };

  // const fetchUnassociatedParents = async () => {
  //   try {
  //     const studentId = 5; // Reemplaza con el ID del estudiante deseado
  //     const parents = await ParentAssociationService.getUnassociatedParents(studentId);
  //     setUnassociatedParents(() => [...parents]); // Actualiza el estado con los padres no asociados
  //   } catch (error) {
  //     console.error('Error al obtener padres no asociados:', error);
  //   }
  // };

  const fetchUnassociatedParents = async (studentId: number) => {
    try {
      const parents =
        await ParentAssociationService.getUnassociatedParents(studentId);
      setUnassociatedParents(() => [...parents]); // Actualiza el estado con los padres no asociados
    } catch (error) {
      console.error("Error al obtener padres no asociados:", error);
    }
  };

  // const fetchDeleteUnassociatedParents = async (parentId: number) => {
  //   try {
  //     const parents = await ParentAssociationService.getUnassociatedParents(parentId);
  //     setUnassociatedParents(() => [...parents]); // Actualiza el estado con los padres no asociados
  //   } catch (error) {
  //     console.error('Error al obtener padres no asociados:', error);
  //   }
  // };

  useEffect(() => {
    fetchStudents();
    fetchRoles();
    fetchParents();
    // fetchUnassociatedParents();
  }, [filterValue, currentPageMain]);

  const fetchStudents = async () => {
    try {
      const params = {
        page: currentPageMain,
        size: itemsPerPage,
        filter: filterValue, // Ajusta según cómo se manejen los filtros en tu API
      };
      //const studentList = await ParentAssociationService.getAllUsers();
      const response = await ParentAssociationService.getAllUsers(params);
      console.log(response);
      setParentsAssociationNames(response.data);
      setTotalPagesMain(response.last_page);

      //const filteredStudents = studentList.filter(student => student.rolId === 1);
      //setStudents();
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const roleList = await StudentService.getAllRols();
      setRoles(roleList);
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };

  const handleAddParentModalShow = async (studentId: number) => {
    const selectedStudent = parentsAssociationNames.find(
      (student) => student.id === studentId
    );
    //console.log(selectedStudent);
    setSelectedParentStudent(selectedStudent || null);
    if (selectedStudent) {
      setLoading(true);
      const unassociatedParents =
        await ParentAssociationService.getUnassociatedParents(
          selectedStudent.id
        );
      setUnassociatedParents(unassociatedParents);
      const parentAssociations =
        await ParentAssociationService.getUsersWithParentAssociations(
          selectedStudent.id
        );
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

  // Define una función para determinar si un botón de asignar debe estar deshabilitado
  const isSelectButtonDisabled = (parentId: number) => {
    return selectingParentId !== null && selectingParentId !== parentId;
  };

  // Define una función para determinar si un botón de eliminar debe estar deshabilitado
  const isDeleteButtonDisabled = (parentId: number) => {
    return deletingParentId !== null && deletingParentId !== parentId;
  };

  const handleDeleteParent = async (parent: ParentAssociation) => {
    // Verifica si selectedParentStudent es null
    if (!selectedParentStudent) {
      console.error("No se ha seleccionado ningún estudiante.");
      return;
    }

    try {
      // Muestra el diálogo de confirmación antes de realizar la eliminación
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el padre asociado. ¿Estás seguro de continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        // Establece el estado de eliminación
        setDeletingParentId(parent.id);
        setDeletingParent(true);

        // Realiza la eliminación del padre asociado
        await ParentAssociationService.deleteParentAssociation(parent.id);

        // Actualiza la lista de padres asociados
        const updatedParentAssociations = parentAssociations.filter(
          (p) => p.id !== parent.id
        );
        setParentsAssociations(updatedParentAssociations);
        console.log("Registro eliminado exitosamente");

        // Actualiza la lista de padres no asociados
        await fetchUnassociatedParents(selectedParentStudent.id);
        await fetchStudents();

        // Muestra una alerta de éxito después de que se complete la eliminación
        Swal.fire(
          "Eliminado",
          "El padre asociado ha sido eliminado correctamente.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
      // Muestra una alerta de error si ocurre algún problema durante la eliminación
      Swal.fire(
        "Error",
        "Se produjo un error al eliminar el padre asociado.",
        "error"
      );
    } finally {
      // Restablece el estado de eliminación después de que se complete la operación
      setDeletingParentId(null);
      setDeletingParent(false);
    }
  };

  const fetchParents = async () => {
    try {
      const parentList = await ParentService.getAllUsers();
      console.log(parentList);
      const filteredParents = parentList.filter((parent) => parent.rolId === 2);
      setParents(filteredParents);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
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
            style={{ width: "400px" }}
          />
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre del estudiante</th>
              {/* <th>Padres</th> */}
              <th>Nombre de Padres</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {parentsAssociationNames.map((student, index) => (
              <tr key={index}>
                <td>
                  {student.studentName} {student.studentLastName}
                </td>
                {/* <td>{student.padres}</td> */}
                <td>
                  {student.padres === 0 ? (
                    <div style={{ color: "gray", fontStyle: "italic" }}>
                      (no se han asociado padres)
                    </div>
                  ) : (
                    <>
                      {student.parentsName.split("\n").map((name, index) => (
                        <div key={index}>{name}</div>
                      ))}
                    </>
                  )}
                </td>

                <td>
                  <Button
                    variant="success"
                    onClick={() => handleAddParentModalShow(student.id)}
                  >
                    Agregar padre
                  </Button>
                  {/* <Button variant="success" onClick={() => handleManageParents(student.id)}>Gestionar padres</Button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination>
          {[...Array(totalPagesMain)].map((_, pageIndex) => (
            <Pagination.Item
              key={pageIndex + 1}
              active={pageIndex + 1 === currentPageMain}
              onClick={() => handlePageChange(pageIndex + 1)}
            >
              {pageIndex + 1}
            </Pagination.Item>
          ))}
        </Pagination>
        <Modal
          show={showAddParentModal}
          onHide={handleAddParentModalClose}
          dialogClassName="modal-xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Asociar padre al estudiante{" "}
              {selectedParentStudent && (
                <small>
                  <strong>
                    <span style={{ color: "red" }}>
                      {selectedParentStudent.studentName}{" "}
                      {selectedParentStudent.studentLastName}
                    </span>
                  </strong>
                </small>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <div>
                {loading ? (
                  <p>Cargando asociaciones de padres...</p>
                ) : parentAssociations.length > 0 ? (
                  <>
                    <h1>Padres asociados al estudiante</h1>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Nombre del padre</th>
                          <th>Estado</th>
                          <th>Accion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parentAssociations.map((parent, index) => (
                          <tr key={index}>
                            <td>
                              {parent.firstName} {parent.lastName}
                            </td>
                            <td>{parent.enabled ? "Activo" : "Inactivo"}</td>
                            <td>
                              <Button
                                variant="danger"
                                onClick={() => handleDeleteParent(parent)}
                                disabled={
                                  isDeleteButtonDisabled(parent.id) ||
                                  deletingParentId === parent.id
                                }
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                ) : (
                  // <div className="alert alert-info text-center" role="alert">
                  //   <h4 className="alert-heading">Información!</h4>
                  //   <p>Este estudiante no tiene padres asociados.</p>
                  // </div>

                  <div className="alert alert-warning text-center" role="alert">
                    <h4 className="alert-heading">Advertencia!</h4>
                    <p>Este estudiante no tiene padres asociados.</p>
                  </div>
                )}
              </div>

              {loading ? (
                <p>Cargando padres no asociados...</p>
              ) : parentAssociations.length < 2 ? (
                <div>
                  <h1>Listado de padres</h1>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Buscar..."
                      value={filterValueParent}
                      onChange={(e) => setFilterValueParent(e.target.value)}
                      style={{ width: "400px" }}
                    />
                  </div>

                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Nombre del padre</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems
                        .filter((parent) => {
                          const fullName =
                            `${parent.firstName} ${parent.lastName}`.toLowerCase();
                          const firstName = parent.firstName.toLowerCase();
                          const lastName = parent.lastName.toLowerCase();
                          const searchValue = filterValueParent.toLowerCase();
                          return (
                            fullName.includes(searchValue) ||
                            (firstName.includes(searchValue.split(" ")[0]) &&
                              lastName.includes(searchValue.split(" ")[1]))
                          );
                        })
                        .map((parent, index) => (
                          <tr key={index}>
                            <td>
                              {parent.firstName} {parent.lastName}
                            </td>
                            <td>
                              <Button
                                variant="btn btn-secondary"
                                onClick={() => handleSelectParent(parent)}
                                disabled={
                                  isSelectButtonDisabled(parent.id) ||
                                  selectingParentId === parent.id
                                }
                              >
                                {selectingParentId === parent.id && (
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ marginRight: "5px" }}
                                  />
                                )}
                                {selectingParentId === parent.id
                                  ? "Asignando..."
                                  : "Asignar"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </Button>
                    {renderPageNumbers}
                    <Button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning text-center" role="alert">
                  <h4 className="alert-heading">Advertencia</h4>
                  <p>Solo se pueden asociar 2 padres por estudiante.</p>
                </div>
              )}

              {/* <h1>Padres Seleccionados</h1>
                    {selectedParents.map((parent, index) => (
                      <div key={index}>
                        <p>{parent.firstName} {parent.lastName}</p>
                        <Button variant="danger" onClick={() => handleDeleteSelectedParent(parent.id)}>Eliminar</Button>
                      </div>
                    ))} */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddParentModalClose}>
              Cerrar
            </Button>
            {/* <Button variant="primary" onClick={handleAddParent}>Guardar</Button> */}
          </Modal.Footer>
        </Modal>

        {/* <Modal show={showParentAssociationModal} onHide={handleParentAssociationModalClose} dialogClassName="modal-xl">
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
</Modal> */}
      </div>
    </div>
  );
};

export default ParentAssociations;
