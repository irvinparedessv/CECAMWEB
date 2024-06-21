// src/components/ProfessorSubjects.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Button } from "react-bootstrap";
import "./style.css";
import ProfessorService from "../../../services/ProfessorService";
import ActivitiesModal from "../activities/ActivitiesModal";

const ProfessorSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
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

  const handleShowModal = async (subjectId, planId) => {
    try {
      const response = await ProfessorService.getActivities(subjectId, planId);
      console.log(subjectId, planId);

      console.log(response);
      setActivities(response);
      setCurrentSubjectId(subjectId);
      setCurrentPlanId(planId);
      setShowModal(true);
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
                    handleShowModal(subject.subjectId, subject.planId)
                  }
                >
                  Ver Actividades
                </Button>
                <Button variant="secondary" className="ml-2">
                  Ver Notas
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <ActivitiesModal
        show={showModal}
        handleClose={handleCloseModal}
        activities={activities}
      />
    </div>
  );
};

export default ProfessorSubjects;
