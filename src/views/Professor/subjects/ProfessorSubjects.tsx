import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import "./style.css";
import ProfessorService from "../../../services/ProfessorService";
import ActivitiesModal from "../activities/ActivitiesModal";
import NotesModal from "../notes/NotesSubjectStudentsModal";
import AddActivityModal from "../activities/CreateActivityModal"; // Asumiendo que tienes un modal para agregar actividad

const ProfessorSubjects = () => {
  const [subjects, setSubjects] = useState([]);
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
        const response = await ProfessorService.getSubjects(
          localStorage.getItem("userId")
        );
        setSubjects(response);
      } catch (error) {
        console.error("There was an error fetching the subjects!", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleShowModal = async (subjectId, gradeId) => {
    try {
      const response = await ProfessorService.getActivities(subjectId, gradeId);

      setActivities(response);
      setCurrentSubjectId(subjectId);
      setCurrentPlanId(gradeId);
      setShowModal(true);
    } catch (error) {
      console.error("There was an error fetching the activities!", error);
    }
  };

  const handleShowModalNotes = async (subjectId, gradeId) => {
    try {
      const response = await ProfessorService.getNotes(subjectId, gradeId);

      setNotes(response);
      setCurrentSubjectId(subjectId);
      setCurrentPlanId(gradeId);
      setShowModalNote(true);
    } catch (error) {
      console.error("There was an error fetching the activities!", error);
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
    setCurrentPlanId(null);
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
      <Row>
        {subjects.map((subject) => (
          <Col key={subject.gradeSubjectId} md={12} className="c_centerpadding">
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
