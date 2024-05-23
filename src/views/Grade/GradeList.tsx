import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import GradeService from "../../services/GradeService";
import { Grade, Professor, GradeProfessors } from "../../types";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import StudentService from "../../services/StudentService";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const GradeList = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [unassociatedProfessors, setUnassociatedProfessors] = useState<Professor[]>([]);
  const [selectedProfessorGrade, setSelectedProfessorGrade] = useState<GradeProfessors | null>(null);
  const [gradeProfessors, setGradeProfessors] = useState<GradeProfessors[]>([]);
  const [filterValueProfessor, setFilterValueProfessor] = useState('');
  const [deletingProfessorId, setDeletingProfessorId] = useState<number | null>(null);
  const [deletingProfessor, setDeletingProfessor] = useState(false);
  const [selectingProfessorId, setSelectingProfessorId] = useState<number | null>(null);
  const [selectingProfessor, setSelectingProfessor] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  

  // Estado para almacenar los padres seleccionados
  const [selectedProfessors, setSelectedProfessors] = useState<Professor[]>([]);
  // Define el estado para el número de página actual
  const [currentPage, setCurrentPage] = useState(1);
  // Define la cantidad de elementos por página
  const itemsPerPage = 5;

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
// Calcula el índice del último elemento en la página actual
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  const currentItems = unassociatedProfessors.slice(indexOfFirstItem, indexOfLastItem);
  
 
  const fetchData = async () => {
    try {
      const response = await GradeService.getAllGrades();
      if (response.success) {
        setGrades(response.data);
      } else {
        setError("Failed to fetch grades");
      }
    } catch (error) {
      setError("Failed to fetch grades");
    }
  };

  useEffect(() => {
    fetchData();
    fetchProfessors();
    fetchGradeProfessors();
  }, []);
  

   
  const handleAddClick = () => {
    navigate('/grades/add');
  };

  const handleEditClick = (gradeId: number) => {
    navigate(`/grades/edit/${gradeId}`); // Utiliza navigate en lugar de history.push
  };
  
  const handleDelete = async (id: number) => {
    try {
      confirmAlert({
        title: "Eliminar",
        message: "Esta seguro de eliminar este registro?",
        buttons: [
          {
            label: "Si",
            onClick: () =>
              toast.promise(
                GradeService.deleteGrade(id).then((response) => {
                  if (response.success) {
                    fetchGradeProfessors();
                  }
                }),
                {
                  loading: "Eliminando...",
                  success: "Eliminado correctamente!",
                  error: <b>Error al eliminar.</b>,
                }
              ),
          },
          {
            label: "No",
          },
        ],
      });
    } catch (error) {
      setError("Failed to delete grade");
    }
  };

  const fetchGradeProfessors = async () => {
    try {
      //const studentList = await ParentAssociationService.getAllUsers();
      const professorList = await GradeService.getAllGradeProfessors();
      setGradeProfessors(professorList);
      // const filteredProfessors = professorList.filter(professor => professor.rolId === 3);
      // setProfessors(filteredProfessors);
    } catch (error) {
      console.error('Error al obtener grados:', error);
    }
  };

  const fetchProfessors = async () => {
    try {
      //const studentList = await ParentAssociationService.getAllUsers();
      const professorList = await StudentService.getAllUsers();
      //setProfessorsAssociationNames(professorList);
      const filteredProfessors = professorList.filter(professor => professor.rolId === 3);
      setProfessors(filteredProfessors);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const fetchUnassociatedProfessors = async (professorId: number) => {
    try {
      const professors = await GradeService.getUnassociatedProfessors(professorId);
      setUnassociatedProfessors(() => [...professors]); // Actualiza el estado con los padres no asociados
    } catch (error) {
      console.error('Error al obtener padres no asociados:', error);
    }
  };

  
  const handleAddParentModalShow = async (gradeId: number) => {
    if (gradeId !== null) {
      setLoading(true);
      const unassociatedProfessors = await GradeService.getUnassociatedProfessors(gradeId);
      setUnassociatedProfessors(unassociatedProfessors);
      const professorAssociations = await GradeService.getGradesWithProfessorAssociations(gradeId);
      setProfessors(professorAssociations);
      const selectedGrade = grades.find(grade => grade.gradeId === gradeId);
      setSelectedGrade(selectedGrade || null); // Guarda el grado seleccionado
      setLoading(false);
      setShowAddParentModal(true);
    }
  };

  const handleAddParentModalClose = () => {
    setShowAddParentModal(false);
     setSelectedProfessorGrade(null);
     setSelectedProfessors([]);
  };

  const saveSelectedProfessor = async (gradeId: number, professorId: number) => {
    try {
      // Aquí debes enviar la solicitud para guardar el padre asociado al estudiante
      await GradeService.saveGradeProfessors(gradeId, professorId);
      console.log('profesor asociado guardado correctamente');
    } catch (error) {
      console.error('Error al guardar el profesor asociado:', error);
    }
  };
  
const handleSelectProfessor = async (professor: Professor) => {
  if (!selectedGrade) {
    console.error('No se ha seleccionado ningún estudiante.');
    return;
  }

  try {
    setSelectingProfessorId(professor.id);
    setSelectingProfessor(true);

    // Mostrar la alerta de confirmación
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción seleccionará el profesor asociado.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, seleccionar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
    });

    // Si el usuario confirma la selección
    if (result.isConfirmed) {
      // Ocultar el botón de cancelar después de que el usuario confirme la selección
      const cancelButton = Swal.getCancelButton();
      if (cancelButton) {
        cancelButton.style.display = 'none';
      }

      // Realizar la selección del padre
      await saveSelectedProfessor(selectedGrade.gradeId, professor.id);

      // Actualizar la lista de padres asociados
      const updatedGradeProfessor = await GradeService.getGradesWithProfessorAssociations(professor.id);
      setProfessors(updatedGradeProfessor);

      // Actualizar la lista de padres no asociados
      await fetchUnassociatedProfessors(professor.id);
      await fetchGradeProfessors();

      // Mostrar una alerta de éxito después de seleccionar el padre
      await Swal.fire({
        title: '¡Seleccionado!',
        text: 'El profesor asociado ha sido seleccionado correctamente.',
        icon: 'success',
        allowOutsideClick: false
      });
    }
  } catch (error) {
    console.error('Error al seleccionar el profesor:', error);
    // Mostrar una alerta de error si ocurre algún problema durante la selección
    Swal.fire(
      'Error',
      'Se produjo un error al seleccionar el profesor asociado.',
      'error'
    );
  } finally {
    // Restablecer el estado después de que se complete la operación
    setSelectingProfessorId(null);
    setSelectingProfessor(false);
  }
};

     // Define una función para determinar si un botón de asignar debe estar deshabilitado
const isSelectButtonDisabled = (professorId:number) => {
  return  selectingProfessorId !== null && selectingProfessorId !== professorId;
};


 // Define una función para determinar si un botón de eliminar debe estar deshabilitado
const isDeleteButtonDisabled = (professorId:number) => {
  return deletingProfessorId !== null && deletingProfessorId !== professorId;
};

  const handleDeleteProfessor = async (professor: Professor) => {
    // Verifica si selectedParentStudent es null
    // console.log(selectedProfessorGrade)
    // if (!selectedProfessorGrade) {
    //   console.error('No se ha seleccionado ningún estudiante.');
    //   return;
    // }
    
    try {
      // Muestra el diálogo de confirmación antes de realizar la eliminación
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el profesor asociado. ¿Estás seguro de continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
      
      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        // Establece el estado de eliminación
        setDeletingProfessorId(professor.id);
        setDeletingProfessor(true);
  
        // Realiza la eliminación del padre asociado
        await GradeService.deleteGradeProfessor(professor.id);
  
        // Actualiza la lista de padres asociados
        const updatedGradeProfessor = professors.filter(p => p.id !== professor.id);
        setProfessors(updatedGradeProfessor);
        console.log('Registro eliminado exitosamente');
  
        // Actualiza la lista de padres no asociados
        await fetchUnassociatedProfessors(professor.id);
        await fetchGradeProfessors();
  
        // Muestra una alerta de éxito después de que se complete la eliminación
        Swal.fire(
          'Eliminado',
          'El profesor asociado ha sido eliminado correctamente.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      // Muestra una alerta de error si ocurre algún problema durante la eliminación
      Swal.fire(
        'Error',
        'Se produjo un error al eliminar el profesor asociado.',
        'error'
      );
    } finally {
      // Restablece el estado de eliminación después de que se complete la operación
      setDeletingProfessorId(null);
      setDeletingProfessor(false);
    }
  };


  return (
    <div>
      <h1>Grados</h1>
      {error && <p>{error}</p>}
      <div className="col c_ButtonAdd">
        <Button
          className="btn btn-primary"
          onClick={handleAddClick}
        >
          Agregar Grado
        </Button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Seccion</th>
            <th>Descripcion</th>
            <th>Coordinador</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gradeProfessors.map((grade) => (
            <tr key={grade.gradeId}>
              <td>{grade.name}</td>
              <td>{grade.section}</td>
              <td>{grade.description}</td>
              <td>
                {grade.firstName && grade.lastName ? (
                  `${grade.firstName} ${grade.lastName}`
                ) : (
                  <span style={{ fontStyle: 'italic', color: 'grey' }}>
                    Sin Profesor Asociado
                  </span>
                )}
              </td>
              <td>
              <Button
                className="btn btn-primary"
                onClick={() => handleEditClick(grade.gradeId)}
              >
                Editar
              </Button>
                <Button
                  className="btn btn-danger"
                  onClick={() => handleDelete(grade.gradeId)}
                >
                  Eliminar
                </Button>
                <Button variant="success" onClick={() => handleAddParentModalShow(grade.gradeId)}>Agregar profesor</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showAddParentModal} onHide={handleAddParentModalClose} dialogClassName="modal-xl">
          <Modal.Header closeButton>
          
            <Modal.Title>Asociar Profesor a Grado {selectedGrade && (
                <small>
                <strong>
                  <span style={{ color: 'red' }}>
                    {selectedGrade.name} {selectedGrade.section}
                  </span>
                </strong>
              </small>

            )}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            
            <div className="container">

              <div>
                  
                  {loading ? (
      <p>Cargando asociaciones de profesores...</p>
    ) : professors.length > 0 ? (
      <>
      <h1>Profesores asociados al grado</h1>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre del profesor</th>
            <th>Estado</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {professors.map((professor, index) => (
            <tr key={index}>
              <td>{professor.firstName} {professor.lastName}</td>
              <td>{professor.enabled ? 'Activo' : 'Inactivo'}</td>
              <td>     

                <Button
                  variant="danger"
                  onClick={() => handleDeleteProfessor(professor)}
                  disabled={isDeleteButtonDisabled(professor.id) || deletingProfessorId === professor.id}
                >
                  {deletingProfessorId === professor.id && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: '5px' }}
                    />
                  )}
                  {deletingProfessorId === professor.id ? 'Eliminando...' : 'Eliminar'}
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
      <p>Este grado no tiene profesor asociado.</p>
      </div>

            

          )}
                                  
                    
              </div>


                {loading ? (
            <p>Cargando profesores no asociados...</p>
        ) : professors.length < 1 ? (
            
            
            <div>

              <h1>Listado de profesores</h1>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Control
                  type="text"
                  placeholder="Buscar..."
                  value={filterValueProfessor}
                  onChange={(e) => setFilterValueProfessor(e.target.value)}
                  style={{ width: '400px' }}
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
    .filter((professor) => {
        const fullName = `${professor.firstName} ${professor.lastName}`.toLowerCase();
        const firstName = professor.firstName.toLowerCase();
        const lastName = professor.lastName.toLowerCase();
        const searchValue = filterValueProfessor.toLowerCase();
        return (
            fullName.includes(searchValue) ||
            (firstName.includes(searchValue.split(' ')[0]) && lastName.includes(searchValue.split(' ')[1]))
        );
    })
    .map((professor, index) => (
        <tr key={index}>
            <td>{professor.firstName} {professor.lastName}</td>
            <td>
                <Button
                    variant="btn btn-secondary"
                    onClick={() => handleSelectProfessor(professor)}
                    disabled={isSelectButtonDisabled(professor.id) || selectingProfessorId === professor.id}
                >
                    {selectingProfessorId === professor.id && (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ marginRight: '5px' }}
                        />
                    )}
                    {selectingProfessorId === professor.id ? 'Asignando...' : 'Asignar'}
                </Button>
            </td>
        </tr>
    ))}

              </tbody>
            </Table>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            {/* <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            {renderPageNumbers}
            <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
              <FontAwesomeIcon icon={faChevronRight} />
  </Button> */}
            </div>
          </div>
          
        ) : (
          <div className="alert alert-warning text-center" role="alert">
  <h4 className="alert-heading">Advertencia</h4>
  <p>Solo se pueden asociar un profesor por grado.</p>
</div>



        

    )}
              
            </div>

            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddParentModalClose}>Cerrar</Button>
            {/* <Button variant="primary" onClick={handleAddParent}>Guardar</Button> */}
          </Modal.Footer>
        </Modal>
    </div>

    
  );
};

export default GradeList;
