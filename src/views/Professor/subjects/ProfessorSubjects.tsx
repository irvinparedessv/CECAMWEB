// src/components/ProfessorSubjects.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Button } from "react-bootstrap";
import "./style.css";
import ProfessorService from "../../../services/ProfessorService";
import ActivitiesModal from "../activities/ActivitiesModal";
import NotesModal from "../notes/NotesModal";

const ProfessorSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalNote, setShowModalNote] = useState(false);
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
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <ActivitiesModal
        show={showModal}
        activities={activities}
        handleClose={handleCloseModal}
        setShowModal={setShowModal}
      />
      <NotesModal
        show={showModalNote}
        notes={notes}
        handleClose={handleCloseModalNote}
      />
    </div>
  );
};

export default ProfessorSubjects;
