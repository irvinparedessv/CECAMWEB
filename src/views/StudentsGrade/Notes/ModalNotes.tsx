// ModalStudentGrades.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Accordion, Card } from "react-bootstrap";
import { GradeService } from "../../../services";
import ParentService from "../../../services/ParentService";
import PlanService from "../../../services/PlanService";

const ModalNotes = ({ show, handleClose, studentId }) => {
  const [studentGrades, setStudentGrades] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        try {
          const response = await ParentService.getNotes(studentId);
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
      ? { name: period.name, percentage: period.percentage, type: period.type }
      : null;
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
          studentGrades.map((subject, subjectIndex) => (
            <Accordion key={subjectIndex}>
              <Accordion.Item eventKey={subjectIndex.toString()}>
                <Accordion.Header as={Card.Header} eventKey={subject}>
                  <h3>
                    {subject.subjectname.toUpperCase()} NOTA:{" "}
                    {parseFloat(subject.generalgrade).toFixed(1)}
                  </h3>
                </Accordion.Header>
                <Accordion.Body>
                  {Object.keys(subject.details)?.map((period, periodIndex) => (
                    <Accordion key={periodIndex + "SA"}>
                      <Accordion.Item eventKey={periodIndex.toString()}>
                        <Accordion.Header as={Card.Header} eventKey={period}>
                          {getPeriodInfo(period)?.name || "Unknown Period"} -
                          Nota Final :{" "}
                          {subject.details[period]
                            .reduce(
                              (total, activity) =>
                                total +
                                (parseFloat(activity.note) *
                                  activity.percentage) /
                                  100,
                              0
                            )
                            .toFixed(1)}
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
                                {subject.details[period].map(
                                  (activity, activityIndex) => (
                                    <tr key={activityIndex}>
                                      <td>{activity.activityname}</td>
                                      <td>{activity.percentage}%</td>
                                      <td>{activity.date}</td>
                                      <td>
                                        {parseFloat(activity.note).toFixed(1)}
                                      </td>
                                    </tr>
                                  )
                                )}
                                <tr>
                                  <td colSpan={3}>Final Grade</td>
                                  <td>
                                    {subject.details[period]
                                      .reduce(
                                        (total, activity) =>
                                          total +
                                          (parseFloat(activity.note) *
                                            activity.percentage) /
                                            100,
                                        0
                                      )
                                      .toFixed(1)}
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </Card.Body>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  ))}
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
