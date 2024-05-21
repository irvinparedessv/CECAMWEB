import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import GradeService from "../../services/GradeService";
import { Grade, Professor } from "../../types";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";

const GradeList = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [unassociatedParents, setUnassociatedParents] = useState<Professor[]>([]);
  // Define el estado para el número de página actual
  const [currentPage, setCurrentPage] = useState(1);
  // Define la cantidad de elementos por página
  const itemsPerPage = 2;

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
// Calcula el índice del último elemento en la página actual
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  const currentItems = unassociatedParents.slice(indexOfFirstItem, indexOfLastItem);
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
  }, []);

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
                    fetchData();
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
  const handleAddParentModalShow = async (gradeId: number) => {
    // const selectedStudent = parentsAssociationNames.find(student => student.id === studentId);
    // //console.log(selectedStudent);
    // setSelectedParentStudent(selectedStudent || null);
    // if (selectedStudent) {
    //   setLoading(true);
    //   const unassociatedParents = await ParentAssociationService.getUnassociatedParents(selectedStudent.id);
    //   setUnassociatedParents(unassociatedParents);
    //     const parentAssociations = await ParentAssociationService.getUsersWithParentAssociations(selectedStudent.id);
    //     setParentsAssociations(parentAssociations);
    //     setLoading(false);
    setShowAddParentModal(true);
    // }
    
  };

  const handleAddParentModalClose = () => {
    setShowAddParentModal(false);
    // setSelectedParentStudent(null);
    // setSelectedParents([]);
  };

  return (
    <div>
      <h1>Grados</h1>
      {error && <p>{error}</p>}
      <div className="col c_ButtonAdd">
        <Link className="btn btn-primary" to="/grades/add">
          Agregar
        </Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Seccion</th>
            <th>Descipcion</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade.gradeId}>
              <td className="c_padding2">{grade.name}</td>
              <td className="c_padding2">{grade.section}</td>
              <td className="c_padding2">{grade.description}</td>
              <td>
                <Link
                  className="btn btn-primary c_margin1"
                  to={`/grades/edit/${grade.gradeId}`}
                >
                  Editar
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(grade.gradeId)}
                >
                  Eliminar
                </button>
                <Button variant="success" onClick={() => handleAddParentModalShow(grade.gradeId)}>Agregar profesor</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showAddParentModal} onHide={handleAddParentModalClose} dialogClassName="modal-xl">
          <Modal.Header closeButton>
            <Modal.Title>Asociar Profesor a G</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            
            <div className="container">

              <div>
                  
                  {loading ? (
      <p>Cargando asociaciones de padres...</p>
    ) : professors.length > 0 ? (
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
          {professors.map((professor, index) => (
            <tr key={index}>
              <td>{professor.firstName} {professor.lastName}</td>
              <td>{professor.enabled ? 'Activo' : 'Inactivo'}</td>
              <td>     

                {/* <Button
                  variant="danger"
                  onClick={() => handleDeleteParent(parent)}
                  disabled={isDeleteButtonDisabled(parent.id) || deletingParentId === parent.id}
                >
                  {deletingParentId === parent.id && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: '5px' }}
                    />
                  )}
                  {deletingParentId === parent.id ? 'Eliminando...' : 'Eliminar'}
                </Button> */}
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
          ) : professors.length < 2 ? (
            
            
            <div>

              <h1>Listado de profesores</h1>
              <div className="d-flex justify-content-between align-items-center mb-3">
                {/* <Form.Control
                  type="text"
                  placeholder="Buscar..."
                  value={filterValueParent}
                  onChange={(e) => setFilterValueParent(e.target.value)}
                  style={{ width: '400px' }}
                /> */}
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
        //const searchValue = filterValueParent.toLowerCase();
        // return (
        //     // fullName.includes(searchValue) ||
        //     // (firstName.includes(searchValue.split(' ')[0]) && lastName.includes(searchValue.split(' ')[1]))
        // );
    })
    .map((professor, index) => (
        <tr key={index}>
            <td>{professor.firstName} {professor.lastName}</td>
            <td>
                {/* <Button
                    variant="btn btn-secondary"
                    onClick={() => handleSelectParent(parent)}
                    disabled={isSelectButtonDisabled(parent.id) || selectingParentId === parent.id}
                >
                    {selectingParentId === parent.id && (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ marginRight: '5px' }}
                        />
                    )}
                    {selectingParentId === parent.id ? 'Asignando...' : 'Asignar'}
                </Button> */}
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
  <p>Solo se pueden asociar 2 padres por estudiante.</p>
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
