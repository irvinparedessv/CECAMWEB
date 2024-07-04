import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Spinner } from "react-bootstrap";
import "./style.css";
import ProfessorService from "../../../services/ProfessorService";
import ActivitiesModal from "../activities/ActivitiesModal";
import NotesModal from "../notes/NotesSubjectStudentsModal";
import AddActivityModal from "../activities/CreateActivityModal";

const ProfessorSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true); // Nuevo estado para el loading spinner
  const [showModal, setShowModal] = useState(false);
  const [showModalNote, setShowModalNote] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false); // Nuevo estado
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState({});
  const [currentSubjectId, setCurrentSubjectId] = useState(null);
  const [currentPlanId, setCurrentPlanId] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true); // Empezar el loading
        const response = await ProfessorService.getSubjects(
          localStorage.getItem("userId")
        );
        setSubjects(response);
      } catch (error) {
        console.error("There was an error fetching the subjects!", error);
      } finally {
        setLoading(false); // Terminar el loading
      }
    };

    fetchSubjects();
  }, []);

  const handleShowModal = async (subjectId, gradeId) => {
    try {
      setCurrentPlanId(gradeId);
      setLoading(true); // Empezar el loading
      const response = await ProfessorService.getActivities(subjectId, gradeId);
      setActivities(response);
      setCurrentSubjectId(subjectId);

      setShowModal(true);
    } catch (error) {
      console.error("There was an error fetching the activities!", error);
    } finally {
      setLoading(false); // Terminar el loading
    }
  };

  const handleShowModalNotes = async (subjectId, gradeId) => {
    try {
      setLoading(true); // Empezar el loading
      const response = await ProfessorService.getNotes(subjectId, gradeId);
      console.log("notas", response);
      setNotes(response);
      setCurrentSubjectId(subjectId);
      setCurrentPlanId(gradeId);
      setShowModalNote(true);
    } catch (error) {
      console.error("There was an error fetching the activities!", error);
    } finally {
      setLoading(false); // Terminar el loading
    }
  };

  const handleShowAddActivityModal = (subjectId, gradeId) => {
    setCurrentSubjectId(subjectId);
    setCurrentPlanId(gradeId);
    setShowAddActivityModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActivities({});
    setCurrentSubjectId(null);
  };

  const handleCloseModalNote = () => {
    setShowModalNote(false);
    setActivities({});
    setCurrentSubjectId(null);
    setCurrentPlanId(null);
  };

  const handleCloseAddActivityModal = () => {
    setShowAddActivityModal(false);
    setCurrentSubjectId(null);
    setCurrentPlanId(null);
  };

  return (
    <div>
      {loading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      <Row>
        {!loading && subjects.length === 0 && (
          <h1>No posee materias encargadas</h1>
        )}
        {!loading &&
          subjects.map((subject) => (
            <Col
              key={subject.gradeSubjectId}
              md={12}
              className="c_centerpadding"
            >
              <Card>
                <Card.Body>
                  <Card.Title>{subject.subject.subjectName}</Card.Title>
                  <Card.Text>
                    Grado: {subject.grade.name} - {subject.grade.section}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleShowModal(subject.subjectId, subject.grade.gradeId)
                    }
                  >
                    Ver Actividades
                  </Button>
                  <Button
                    variant="secondary"
                    className="ml-2"
                    onClick={() =>
                      handleShowModalNotes(
                        subject.subjectId,
                        subject.grade.gradeId
                      )
                    }
                  >
                    Ver Notas
                  </Button>
                  <Button
                    variant="success"
                    className="ml-2"
                    onClick={() =>
                      handleShowAddActivityModal(
                        subject.subjectId,
                        subject.grade.gradeId
                      )
                    }
                  >
                    Agregar Actividad
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
      <ActivitiesModal
        gradeId={currentPlanId}
        show={showModal}
        activities={activities}
        handleClose={handleCloseModal}
      />
      <NotesModal
        show={showModalNote}
        notes={notes}
        handleClose={handleCloseModalNote}
      />
      <AddActivityModal
        show={showAddActivityModal}
        handleClose={handleCloseAddActivityModal}
        subjectId={currentSubjectId}
        gradeId={currentPlanId}
      />
    </div>
  );
};

export default ProfessorSubjects;
