import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Accordion } from "react-bootstrap";
import "./study.css";
import SubjectService from "./../../services/SubjectService";
import PlanService from "../../services/PlanService";
import {
  Activity,
  ActivitySave,
  Period,
  SaveSubject,
  TypePeriod,
} from "../../types/Plans";
import { Subject } from "../../types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const StudyPlan: React.FC = () => {
  const navigate = useNavigate();
  const [typePeriods, setTypePeriods] = useState<TypePeriod[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [name, setName] = useState<string>("");

  const [typePeriod, setTypePeriod] = useState<string>("");
  const [newSubject, setNewSubject] = useState<string>("");
  const [newActivitie, setNewActivitie] = useState<ActivitySave>({
    description: "",
    typeId: "",
    percentage: 0,
  });

  const [isGlobal, setIsGlobal] = useState<string>("");
  const [showModalSubject, setShowModalSubject] = useState<boolean>(false);
  const [showModalAct, setShowModalAct] = useState<boolean>(false);

  const [subjectsSave, setSubjectsSave] = useState<SaveSubject[]>([]);
  const [globalSubjects, setGlobalSubjects] = useState<SaveSubject[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState<
    number | null
  >(null);

  const staticTypes = [
    { name: "DETALLE ACTIVIDADES POR MATERIA", value: false },
    { name: "DETALLE GLOBAL MATERIAS", value: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await SubjectService.getAllSubjects();
      setSubjects(response);
    };

    fetchData();

    const fetchTypePeriods = async () => {
      const response = await PlanService.getTypes();
      setTypePeriods(response);
    };

    fetchTypePeriods();

    const fetchActivities = async () => {
      const response = await PlanService.getActivities();
      setActivities(response);
    };

    fetchActivities();

    const fetchPeriods = async () => {
      const response = await PlanService.getPeriods();
      setPeriods(response);
    };

    fetchPeriods();
  }, []);

  const handleSelectSubject = async (value: string) => {
    const selectedPeriods = periods.filter(
      (period) => period.typePeriodId === Number(typePeriod)
    );
    const selectedSubject = subjects.find(
      (subject) => subject.subjectId === Number(value)
    );

    if (!selectedSubject) {
      return; // Salir si no se encuentra la materia seleccionada
    }
    const alreadyExists =
      isGlobal === "true"
        ? globalSubjects.some(
            (subject) => subject.subject.subjectId === selectedSubject.subjectId
          )
        : subjectsSave.some(
            (subject) => subject.subject.subjectId === selectedSubject.subjectId
          );

    if (alreadyExists) {
      alert("La materia ya ha sido seleccionada.");
      return;
    }

    if (isGlobal === "true") {
      // Si es global, agregar la materia a globalSubjects
      const newGlobalSubject: SaveSubject = {
        subject: selectedSubject,
        periods: selectedPeriods.map((period) => ({
          period,
          totalPercentage: 0,
          activities: [],
        })),
      };
      setGlobalSubjects((prevGlobalSubjects) => [
        ...prevGlobalSubjects,
        newGlobalSubject,
      ]);
    } else {
      // Si no es global, agregar la materia a subjectsSave
      const newSubject: SaveSubject = {
        subject: selectedSubject,
        periods: selectedPeriods.map((period) => ({
          period,
          totalPercentage: 0,
          activities: [],
        })),
      };
      setSubjectsSave((prevSubjects) => [...prevSubjects, newSubject]);
    }

    // Restablecer el estado del nuevo sujeto y cerrar el modal
    setNewSubject("");
    setShowModalSubject(false);
  };

  const handleAddSubject = () => {
    // logic to add a new subject
  };

  const savePlan = () => {
    if (
      name === "" ||
      typePeriod === "" ||
      isGlobal === "" ||
      subjectsSave.length === 0
    ) {
      alert("Por favor complete todos los campos!");
      return;
    }
    if (
      subjectsSave.some((subject) =>
        subject.periods.some((period) => period.activities.length === 0)
      )
    ) {
      alert("Debe agregarse al menos una actividad al periodo!");
      return;
    }

    const dataSave = {
      namePlan: name,
      typePlan: typePeriod,
      isGlobal: isGlobal,
      subjects: subjectsSave,
      subjectsGlobal: globalSubjects,
    };
    PlanService.savePlan(dataSave);
    toast.success("Guardado");
    navigate("/plans");
  };

  const handleAddActivity = () => {
    if (
      !newActivitie.typeId ||
      !newActivitie.description ||
      !newActivitie.percentage
    ) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if (selectedPeriod && selectedSubjectIndex !== null) {
      const updatedSubjects = [...subjectsSave];
      const subjectToUpdate = updatedSubjects[selectedSubjectIndex];

      const periodToUpdate = subjectToUpdate.periods.find(
        (p) => p.period.periodId === selectedPeriod.periodId
      );

      if (periodToUpdate) {
        const currentTotalPercentage = periodToUpdate.activities.reduce(
          (total, activity) => total + activity.percentage,
          0
        );
        const newTotalPercentage =
          currentTotalPercentage + newActivitie.percentage;

        if (newTotalPercentage > 100) {
          const confirmAdd = window.confirm(
            `La suma de porcentajes excede el 100% (${newTotalPercentage}%). ¿Desea agregar la actividad de todas formas?`
          );

          if (!confirmAdd) {
            return;
          }
        }

        periodToUpdate.activities.push(newActivitie);

        const newPeriods = subjectToUpdate.periods.map((p) => {
          if (p.period.periodId === selectedPeriod.periodId) {
            const total = p.activities.reduce(
              (total, act) => total + act.percentage,
              0
            );
            return {
              ...p,
              activities: p.activities,
              totalPercentage: total,
            };
          }
          return p;
        });

        const newSubjectsSave = updatedSubjects.map((subject, index) =>
          index === selectedSubjectIndex
            ? { ...subject, periods: newPeriods }
            : subject
        );

        setSubjectsSave(newSubjectsSave);
        setShowModalAct(false);
        setNewActivitie({ description: "", typeId: "", percentage: 0 });
      }
    }
  };

  const handleRemoveSubject = (subjectIndex: number) => {
    const updatedSubjects = subjectsSave.filter(
      (_, index) => index !== subjectIndex
    );
    setSubjectsSave(updatedSubjects);
  };

  const handleRemoveActivity = (
    subjectIndex: number,
    periodIndex: number,
    activityIndex: number
  ) => {
    const updatedSubjects = [...subjectsSave];
    const subjectToUpdate = updatedSubjects[subjectIndex];
    const periodToUpdate = subjectToUpdate.periods[periodIndex];

    periodToUpdate.activities = periodToUpdate.activities.filter(
      (_, index) => index !== activityIndex
    );
    periodToUpdate.totalPercentage = periodToUpdate.activities.reduce(
      (total, activity) => total + activity.percentage,
      0
    );

    setSubjectsSave(updatedSubjects);
  };

  const handleGlobalChange = (value: string) => {
    setIsGlobal(value);

    if (value === "true") {
      // Add "General" subject and move selected subjects to globalSubjects
      const generalSubject = {
        subject: { subjectId: -1, subjectName: "General", code: "" },
        periods: periods
          .filter((period) => period.typePeriodId === Number(typePeriod))
          .map((period) => ({
            period,
            totalPercentage: 0,
            activities: [],
          })),
      };
      setGlobalSubjects([...subjectsSave]);
      setSubjectsSave([generalSubject]);
    } else {
      // Reset the subjectsSave to original subjects
      setSubjectsSave(globalSubjects);
      setGlobalSubjects([]);
    }
  };

  return (
    <div className="containerPlan">
      <div>
        <h2>Plan de Estudio</h2>
        <div className="card">
          <div className="row">
            <div className="col-xl-3 col-lg-3">
              <div className="row">
                <label>Nombre Plan</label>
              </div>
              <Form.Control
                type="string"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {name !== "" && (
              <div className="col-xl-2 col-lg-2">
                <div className="row">
                  <label>Periodo</label>
                </div>

                <Form.Select
                  onChange={(e) => {
                    setTypePeriod(e.target.value);
                    setSubjectsSave([]);
                    setGlobalSubjects([]);
                  }}
                  value={typePeriod}
                >
                  <option value={""}>Selecciona el Periodo</option>
                  {typePeriods.map((typePeriod, index) => (
                    <option key={index} value={typePeriod.typePeriodId}>
                      {typePeriod.typeName}
                    </option>
                  ))}
                </Form.Select>
              </div>
            )}
            {typePeriod !== "" && (
              <div className="col-xl-3 col-lg-3">
                <div className="row">
                  <label>Detalle</label>
                </div>
                <Form.Select
                  onChange={(e) => handleGlobalChange(e.target.value)}
                  value={isGlobal}
                >
                  <option value={""}>Selecciona el tipo</option>
                  {staticTypes.map((type, index) => (
                    <option key={index} value={String(type.value)}>
                      {type.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
            )}

            {isGlobal !== "" && (
              <div className="col-xl-3 col-lg-3">
                <div className="row">
                  <label>Selecciona o Crea una materia</label>
                </div>
                <Form.Select id="select-materia">
                  <option value={""}>Seleccionar Materia</option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject.subjectId}>
                      {subject.subjectName}
                    </option>
                  ))}
                </Form.Select>
                <Button
                  onClick={() =>
                    handleSelectSubject(
                      (
                        document.getElementById(
                          "select-materia"
                        ) as HTMLSelectElement
                      ).value
                    )
                  }
                >
                  Agregar Materia
                </Button>
                <Button onClick={() => setShowModalSubject(true)}>
                  Crear Nueva Materia
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="materias-list">
          {subjectsSave.map((subject, index) => (
            <Accordion defaultActiveKey="0" key={index + "sa"}>
              <Accordion.Item
                eventKey={index.toString()}
                className="c_itemsubject"
              >
                <Accordion.Header>
                  <h4>
                    {subject.subject.subjectName}{" "}
                    {isGlobal === "true" && globalSubjects.length > 0
                      ? `(${globalSubjects.map((sub) => sub.subject.subjectName).join(", ")})`
                      : ""}
                  </h4>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveSubject(index)}
                    style={{ marginLeft: "auto" }}
                  >
                    Remover Materia
                  </Button>
                </Accordion.Header>
                <Accordion.Body>
                  <div key={index} className="card card-shadow">
                    <Accordion defaultActiveKey="0">
                      {subject.periods.map((period, idx) => (
                        <Accordion.Item eventKey={idx.toString()} key={idx}>
                          <Accordion.Header>
                            {" "}
                            {period.period.name} (Total:{" "}
                            {period.totalPercentage} / 100 %)
                          </Accordion.Header>
                          <Accordion.Body>
                            <ul>
                              {period.activities.map((activity, actIdx) => (
                                <li key={actIdx}>
                                  {activity.description} - {activity.percentage}
                                  %
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                      handleRemoveActivity(index, idx, actIdx)
                                    }
                                    style={{ marginLeft: "10px" }}
                                  >
                                    Remover
                                  </Button>
                                </li>
                              ))}
                            </ul>
                            <Button
                              onClick={() => {
                                setShowModalAct(true);
                                setSelectedPeriod(period.period);
                                setSelectedSubjectIndex(index);
                              }}
                            >
                              Agregar Actividad
                            </Button>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))}
        </div>
      </div>
      <Modal show={showModalSubject} onHide={() => setShowModalSubject(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Materia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombreMateria">
              <Form.Label>Nombre de la materia:</Form.Label>
              <Form.Control
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Ingrese el nombre de la materia"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalSubject(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddSubject}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalAct} onHide={() => setShowModalAct(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Actividad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formtype">
              <Form.Select
                onChange={(e) =>
                  setNewActivitie({
                    ...newActivitie,
                    typeId: e.target.value,
                  })
                }
              >
                <option value={""}>Seleccionar Materia</option>
                {activities.map((activity, index) => (
                  <option key={index} value={activity.typeId}>
                    {activity.typeName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {newActivitie.typeId ? (
              <>
                <Form.Group controlId="formActividad">
                  <Form.Label>Nombre:</Form.Label>
                  <Form.Control
                    type="text"
                    value={newActivitie.description}
                    onChange={(e) =>
                      setNewActivitie({
                        ...newActivitie,
                        description: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formPorcentaje">
                  <Form.Label>Porcentaje:</Form.Label>
                  <Form.Control
                    type="number"
                    value={newActivitie.percentage}
                    onChange={(e) =>
                      setNewActivitie({
                        ...newActivitie,
                        percentage: Number(e.target.value),
                      })
                    }
                  />
                </Form.Group>
              </>
            ) : null}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalAct(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleAddActivity}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
      <Button onClick={savePlan}>GUARDAR</Button>
    </div>
  );
};

export default StudyPlan;
