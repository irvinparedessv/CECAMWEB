// ModalStudentGrades.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Accordion, Card } from "react-bootstrap";
import ParentService from "../../../services/ParentService";

interface Subject {
  subjectId: number;
  subjectName: string;
  code: string;
  created_at: string;
  updated_at: string;
}

interface ActivityDetail {
  activityId: number;
  studentId: number;
  note: number;
  notePercentage: number;
  notePeriod: number;
}

interface Activity {
  activityId: number;
  percentage: number;
  description: string;
  dueDate: string | null;
  created_at: string;
  updated_at: string;
  periodId: number;
  subjectId: number;
  typeId: number;
  gradeId: number | null;
  details: ActivityDetail[] | null;
  subject: Subject;
}

interface Period {
  periodId: number;
  name: string;
  percentage: number;
  typePeriodId: number;
}

interface StudentGrades {
  [subjectName: string]: {
    [periodId: string]: Activity[];
  };
}

interface GradesData {
  student_grades: StudentGrades;
  periods: Period[];
}

const ModalNotes = ({ show, handleClose, studentId }) => {
  const [studentGrades, setStudentGrades] = useState<StudentGrades>(null);
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        try {
          const response: GradesData = await ParentService.getNotes(studentId);
          console.log(response.student_grades);
          setStudentGrades(response.student_grades);
          setPeriods(response.periods);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [show, studentId]);

  const getPeriodInfo = (periodId) => {
    const period = periods.find((p) => p.periodId == periodId);
    return period
      ? {
          name: period.name,
          percentage: period.percentage,
          type: period.typePeriodId,
        }
      : null;
  };
  const calculateGlobalGrade = (subjectGrades) => {
    const periods = Object.keys(subjectGrades);
    const totalGrade = periods.reduce((total, period) => {
      const periodActivities = subjectGrades[period];
      const periodGrade = parseFloat(calculateFinalGrade(periodActivities));
      return total + periodGrade;
    }, 0);

    const globalGrade = (totalGrade / periods.length).toFixed(1);
    return globalGrade;
  };

  const calculateGrade = (activity) => {
    if (activity.details && activity.details.length > 0) {
      return parseFloat(activity.details[0].note.toFixed(1));
    }
    return activity.gradeId !== null
      ? parseFloat(activity.gradeId.toFixed(1))
      : "N/A";
  };

  const calculateFinalGrade = (activities) => {
    return activities
      .reduce(
        (total, activity) =>
          total +
          ((activity.details && activity.details.length > 0
            ? parseFloat(activity.details[0].note)
            : 0) *
            activity.percentage) /
            100,
        0
      )
      .toFixed(1);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Notas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          Object.keys(studentGrades)?.map((subject, subjectIndex) => (
            <Accordion key={subjectIndex}>
              <Accordion.Item eventKey={subjectIndex.toString()}>
                <Accordion.Header as={Card.Header} eventKey={subject}>
                  <h3>{subject.toUpperCase()}</h3>
                  <h3>-NOTA: {calculateGlobalGrade(studentGrades[subject])}</h3>
                </Accordion.Header>
                <Accordion.Body>
                  {Object.keys(studentGrades[subject])?.map(
                    (period, periodIndex) => (
                      <Accordion key={periodIndex + "SA"}>
                        <Accordion.Item eventKey={periodIndex.toString()}>
                          <Accordion.Header as={Card.Header} eventKey={period}>
                            {getPeriodInfo(period)?.name || "Unknown Period"} -{" "}
                            {calculateFinalGrade(
                              studentGrades[subject][period]
                            )}
                          </Accordion.Header>
                          <Accordion.Body>
                            <Card.Body>
                              <Table striped bordered hover>
                                <thead>
                                  <tr>
                                    <th>Actividad</th>
                                    <th>Porcentaje</th>
                                    <th>Fecha</th>
                                    <th>Nota</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {studentGrades[subject][period] &&
                                    studentGrades[subject][period].map(
                                      (activity, activityIndex) => (
                                        <tr key={activityIndex}>
                                          <td>{activity.description}</td>
                                          <td>{activity.percentage}%</td>
                                          <td>{activity.dueDate || "N/A"}</td>
                                          <td>{calculateGrade(activity)}</td>
                                        </tr>
                                      )
                                    )}
                                  <tr>
                                    <td colSpan={3}>Nota Total</td>
                                    <td>
                                      {calculateFinalGrade(
                                        studentGrades[subject][period]
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </Card.Body>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    )
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalNotes;
