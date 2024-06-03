import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import GradeService from "../../services/GradeService";
import { Grade, Professor, GradeProfessors, GradeFormAdd } from "../../types";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);
  const [filterValue, setFilterValue] = useState('');

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

  const [formData, setFormData] = useState<GradeFormAdd>({
    gradeId: 0,
    name: "",
    section: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  //const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [isSaving, setIsSaving] = useState(false);

  // const handleCancel = () => {
  //   navigate("/grades");
  // };
  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   // Validar campos requeridos
  //   const newErrors: { [key: string]: string } = {};
  //   Object.entries(formData).forEach(([key, value]) => {
  //     if (value.trim() === "") {
  //       newErrors[key] =
  //         `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
  //     }
  //   });
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     toast.promise(GradeService.addGrade(formData), {
  //       loading: "Guardando...",
  //       success: <b>Grado guardado!</b>,
  //       error: <b>Error en guardado.</b>,
  //     });
  //     setTimeout(() => {
  //       navigate("/grades");
  //     }, 1000);
  //   } catch (error) {
  //     console.error("Error creating grade:", error);
  //   }
  // };


  const handleAddModalShow = (gradeId: number | null) => {
    setSelectedGradeId(gradeId);
    setShowAddModal(true);
  
    if (gradeId !== null) {
      const selectedGrade = grades.find(grade => grade.gradeId === gradeId);
      if (selectedGrade) {
        setFormData({
          gradeId: selectedGrade.gradeId,
          name: selectedGrade.name,
          section: selectedGrade.section,
          description: selectedGrade.description,
        });
      }
    } else {
      setFormData({
        gradeId: 0,
        name: "",
        section: "",
        description: "",
      });
    }
  };



  const handleAddModalClose = () => {
    setShowAddModal(false);
    setSelectedGradeId(null);
    setFormData({
      gradeId: 0,
      name: "",
      section: "",
      description: "",
    });
  };












  
 
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
  

   
  // const handleAddClick = () => {
  //   navigate('/grades/add');
  // };

  // const handleEditClick = (gradeId: number) => {
  //   navigate(`/grades/edit/${gradeId}`); // Utiliza navigate en lugar de history.push
  // };
  
  // const handleDelete = async (id: number) => {
  //   try {
  //     confirmAlert({
  //       title: "Eliminar",
  //       message: "Esta seguro de eliminar este registro?",
  //       buttons: [
  //         {
  //           label: "Si",
  //           onClick: () =>
  //             toast.promise(
  //               GradeService.deleteGrade(id).then((response) => {
  //                 if (response.success) {
  //                   fetchGradeProfessors();
  //                 }
  //               }),
  //               {
  //                 loading: "Eliminando...",
  //                 success: "Eliminado correctamente!",
  //                 error: <b>Error al eliminar.</b>,
  //               }
  //             ),
  //         },
  //         {
  //           label: "No",
  //         },
  //       ],
  //     });
  //   } catch (error) {
  //     setError("Failed to delete grade");
  //   }
  // };

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: 'Eliminar',
        text: '¿Está seguro de eliminar este grado?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No'
      });
  
      if (result.isConfirmed) {
        const response = await GradeService.deleteGrade(id);
        if (response.success) {
          await fetchGradeProfessors();
          Swal.fire(
            'Eliminado',
            'El grado se ha sido eliminado correctamente.',
            'success'
          );
        } else {
          Swal.fire(
            'Error',
            'Se produjo un error al intentar eliminar este grado.',
            'error'
          );
        }
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'Se produjo un error al intentar eliminar el grado.',
        'error'
      );
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

  const fetchUnassociatedProfessors = async (gradeId: number) => {
    try {
      const professors = await GradeService.getUnassociatedProfessors(gradeId);
      setUnassociatedProfessors(() => [...professors]); // Actualiza el estado con los padres no asociados
    } catch (error) {
      console.error('Error al obtener padres no asociados:', error);
    }
  };

  
  const handleAddParentModalShow = async (gradeId: number) => {
    // if (gradeId !== null) {
    //   setLoading(true);
     
    //   const selectedGrade = grades.find(grade => grade.gradeId === gradeId);
    //   setSelectedGrade(selectedGrade || null); // Guarda el grado seleccionado
    //   setLoading(false);
    //   setShowAddParentModal(true);
    // }


    const selectedGrade = gradeProfessors.find(grade => grade.gradeId === gradeId);
    //console.log(selectedStudent);
    setSelectedProfessorGrade(selectedGrade || null);
    if (selectedGrade) {
      setLoading(true);
      const unassociatedProfessors = await GradeService.getUnassociatedProfessors(selectedGrade.gradeId);
      setUnassociatedProfessors(unassociatedProfessors);
      const professorAssociations = await GradeService.getGradesWithProfessorAssociations(selectedGrade.gradeId);
      setProfessors(professorAssociations);
        setLoading(false);
    setShowAddParentModal(true);
    }
  };

  const handleAddParentModalClose = () => {
    setShowAddParentModal(false);
     setSelectedProfessorGrade(null);
     setSelectedProfessors([]);
     //fetchGradeProfessors();
  };


  //ERROR EN EL HANDLEADDGRADE, AQUI ESTA CORREGIDO, TENIA QUE CARGAR LOS METODOS DEL useEffect(())
  const handleAddGrade = async () => {
    setIsSaving(true);
    try {
      // Verificar campos obligatorios
      if (!formData.name || !formData.section || !formData.description) {
        return Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      }

      // Agregar el grado
      await GradeService.addGrade(formData);
      setShowAddModal(false);
      fetchGradeProfessors();
  
      // Actualizar manualmente selectedGrade con el nuevo grado agregado
      const newGrade = { ...formData };
      setSelectedGrade(newGrade);

      fetchData();
      fetchProfessors();
    //fetchGradeProfessors();
  
      // Mostrar el modal y pasar el ID del nuevo grado agregado
      //handleAddParentModalShow(newGrade.gradeId);
  
      // Mostrar una alerta de éxito después de agregar el grado
      Swal.fire('Éxito', 'El grado ha sido agregado correctamente.', 'success');
    } catch (error) {
      console.error('Error al insertar grado:', error);
      Swal.fire('Error', 'Se produjo un error al intentar agregar el grado.', 'error');
    }finally {
      setIsSaving(false);
    }
  };
  


  const handleUpdateGrade = async () => {
    setIsSaving(true);
    try {
      // Verificar campos obligatorios
      if (!formData.name || !formData.section || !formData.description) {
        return Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      }
      
      // const newErrors: { [key: string]: string } = {};
      // Object.entries(formData).forEach(([key, value]) => {
      //   if (value.trim() === "") {
      //     newErrors[key] =
      //       `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      //   }
      // });
      // if (Object.keys(newErrors).length > 0) {
      //   setErrors(newErrors);
      //   return;
      // }

      // Actualizar el padre
      if (selectedGradeId !== null) {
        await GradeService.updateGrade(selectedGradeId, formData);
        setShowAddModal(false);
        fetchGradeProfessors();
  
        // Mostrar una alerta de éxito
        Swal.fire('Éxito', 'Los cambios han sido guardados correctamente.', 'success');
      }
    } catch (error) {
      console.error('Error al actualizar padre:', error);
      Swal.fire('Error', 'Se produjo un error al intentar guardar los cambios.', 'error');
    }finally {
      setIsSaving(false);
    }
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
  if (!selectedProfessorGrade) {
    console.error('No se ha seleccionado ningún professor.');
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
      await saveSelectedProfessor(selectedProfessorGrade.gradeId, professor.id);

      // Actualizar la lista de padres asociados
      const updatedGradeProfessor = await GradeService.getGradesWithProfessorAssociations(selectedProfessorGrade.gradeId);
      setProfessors(updatedGradeProfessor);

      // Actualizar la lista de padres no asociados
      await fetchUnassociatedProfessors(selectedProfessorGrade.gradeId);
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
    if (!selectedProfessorGrade) {
      console.error('No se ha seleccionado ningún estudiante.');
      return;
    }
    
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
        await fetchUnassociatedProfessors(selectedProfessorGrade.gradeId);
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Control
            type="text"
            placeholder="Buscar..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={{ width: '400px' }}
          />
          <Button variant="primary" onClick={() => handleAddModalShow(null)}>Agregar Grado</Button>
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
          {gradeProfessors
          .filter((grade) => {
            const gradeName = `${grade.name}`.toLowerCase();
            const searchValue = filterValue.toLowerCase();
            return gradeName.includes(searchValue);
        }).map((grade, gradeIndex) => (
            
            <tr key={gradeIndex}>
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
              <Button variant="primary" onClick={() => handleAddModalShow(grade.gradeId)}>Editar</Button>
                <Button
                  className="btn btn-danger"
                  onClick={() => handleDelete(grade.gradeId)}
                >
                  Eliminar
                </Button>
                <Button variant="success" onClick={() => handleAddParentModalShow(grade.gradeId)}>Asignar coordinador</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showAddParentModal} onHide={handleAddParentModalClose} dialogClassName="modal-xl">
          <Modal.Header closeButton>
          
            <Modal.Title>Asociar Profesor a Grado {selectedProfessorGrade && (
                <small>
                <strong>
                  <span style={{ color: 'red' }}>
                    {selectedProfessorGrade.name} {selectedProfessorGrade.section}
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

        <Modal show={showAddModal} onHide={handleAddModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedGradeId !== null ? 'Editar Grado' : 'Agregar Grado'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control  className="form-control"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required />
                  {errors.name && <div className="error-message">{errors.name}</div>}
              </Form.Group>
              <Form.Group controlId="formSeccion">
                <Form.Label>Seccion</Form.Label>
                <Form.Control  className="form-control"
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  required />
                  {errors.section && (
                    <div className="error-message">{errors.section}</div>
                  )}
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Descripcion</Form.Label>
                <Form.Control  className="form-control"
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required/>
                  {errors.description && (
                    <div className="error-message">{errors.description}</div>
                  )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddModalClose}>Cancelar</Button>
            {/* <Button variant="primary" onClick={selectedGradeId !== null ? handleUpdateGrade : handleAddGrade}>
              {selectedGradeId !== null ? 'Guardar Cambios' : 'Agregar'}
            </Button> */}
            <Button 
              variant="primary" 
              onClick={selectedGradeId !== null ? handleUpdateGrade : handleAddGrade}
              disabled={isSaving}
            >
            {isSaving ? 'Guardando...' : (selectedGradeId !== null ? 'Guardar' : 'Agregar')}
          </Button>
          </Modal.Footer>
        </Modal>
    </div>
    

    
  );
};

export default GradeList;
