import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Accordion, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
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
import { Plan } from "../../types/PlanEdit";
import Swal from "sweetalert2";

const PlanEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtener planId desde los parámetros de la ruta
  const [typePeriods, setTypePeriods] = useState<TypePeriod[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [name, setName] = useState<string>("");

  const [typePeriod, setTypePeriod] = useState<string>("");
  const [newActivitie, setNewActivitie] = useState<ActivitySave>({
    description: "",
    typeId: "",
    percentage: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado de carga

  const [isGlobal, setIsGlobal] = useState<string>("");
  const [showModalAct, setShowModalAct] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [subjectsSave, setSubjectsSave] = useState<SaveSubject[]>([]);
  const [globalSubjects, setGlobalSubjects] = useState<SaveSubject[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState<
    number | null
  >(null);
  const navigate = useNavigate();

  const staticTypes = [
    { name: "DETALLE ACTIVIDADES POR MATERIA", value: false },
    { name: "DETALLE GLOBAL MATERIAS", value: true },
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      const subjectsResponse = await SubjectService.getAllSubjects();
      setSubjects(subjectsResponse);

      const typePeriodsResponse = await PlanService.getTypes();
      setTypePeriods(typePeriodsResponse);

      const activitiesResponse = await PlanService.getActivities();
      setActivities(activitiesResponse);

      const periodsResponse = await PlanService.getPeriods();
      setPeriods(periodsResponse);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchPlan = async () => {
        setIsLoading(true); // Indicar inicio de carga

        const response = await PlanService.getPlan(id);
        const plan: Plan = response.plan;
        setName(plan.name);
        setTypePeriod(String(plan.typePeriodId));
        setIsGlobal(String(!plan.isDetail));
        const uniqueSubjects: Subject[] = [];
        const subjectIds = new Set();

        plan.activities.forEach((activity) => {
          if (!subjectIds.has(activity.subjectId)) {
            subjectIds.add(activity.subjectId);
            uniqueSubjects.push(activity.subject);
          }
        });
        const globalSubjects = response.subjects.map((subject) => ({
          ...subject,
        }));
        setGlobalSubjects(globalSubjects);

        if (plan.isDetail) {
          setSubjectsSave([...response.subjects]); // Copia superficial de response.subjects
        } else {
          const global = {
            ...response.subjects[0], // Copia profunda del primer objeto
            subject: {
              ...response.subjects[0].subject,
              subjectName: "Global", // Modifica solo en esta copia
            },
          };
          setSubjectsSave([global]); // Almacena en subjectsSave
        }
        setIsLoading(false);
      };

      fetchPlan();
    }
  }, [id]);
  const handleAddActivity = () => {
    if (
      !newActivitie.typeId ||
      !newActivitie.description ||
      !newActivitie.percentage
    ) {
      Swal.fire({
        icon: "error",
        title: "Validacion",
        text: "Por favor complete todos los campos!",
        allowOutsideClick: true,
      });
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
          (total, activity) => Number(total) + Number(activity.percentage),
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
              (total, act) => Number(total) + Number(act.percentage),
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
      (total, activity) => Number(total) + Number(activity.percentage),
      0
    );

    setSubjectsSave(updatedSubjects);
  };
  const savePlan = async () => {
    if (
      name === "" ||
      typePeriod === "" ||
      isGlobal === "" ||
      subjectsSave.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Validacion",
        text: "Por favor complete todos los campos!",
        allowOutsideClick: true,
      });
      return;
    }
    if (
      subjectsSave.some((subject) =>
        subject.periods.some((period) => period.activities.length === 0)
      )
    ) {
      Swal.fire({
        icon: "error",
        title: "Validacion",
        text: "Debe agregarse al menos una actividad al periodo!",
        allowOutsideClick: true,
      });
      return;
    }
    setLoading(true);
    const dataSave = {
      idPlan: id,
      namePlan: name,
      typePlan: typePeriod,
      isGlobal: isGlobal,
      subjects: subjectsSave,
      subjectsGlobal: globalSubjects,
    };
    try {
      await PlanService.editPlan(dataSave);
      Swal.fire({
        icon: "success",
        title: "Guardado",
        text: "Se ha editado el plan correctamente.",
        allowOutsideClick: true,
      });
      navigate("/plans");
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Guardado",
        text: err?.response?.data?.message,
        allowOutsideClick: true,
      });
    }
    setLoading(false);
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
      Swal.fire({
        icon: "error",
        title: "Validacion",
        text: "La materia ya ha sido seleccionada.",
        allowOutsideClick: true,
      });
      return;
    }

    if (isGlobal === "true") {
      // Si es global, agregar la materia a globalSubjects
      // Si es global, agregar la materia a globalSubjects
      if (globalSubjects.length > 0) {
        //tomar actividades del subject
        const newGlobalSubject: SaveSubject = {
          subject: selectedSubject,
          periods: globalSubjects[0].periods,
        };
        setGlobalSubjects((prevGlobalSubjects) => [
          ...prevGlobalSubjects,
          newGlobalSubject,
        ]);
      } else {
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
      }
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
  };

  return (
    <div className="containerPlan">
      {isLoading && ( // Mostrar Spinner de carga si isLoading es true
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      )}
      {!isLoading && (
        <>
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
                      disabled
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
                      disabled
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
                                      {activity.description} -{" "}
                                      {activity.percentage}%
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                          handleRemoveActivity(
                                            index,
                                            idx,
                                            actIdx
                                          )
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

          <Modal show={showModalAct} onHide={() => setShowModalAct(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Agregar Actividad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formtype">
                  <Form.Label>Tipo de Actividad:</Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setNewActivitie({
                        ...newActivitie,
                        typeId: e.target.value,
                      })
                    }
                  >
                    <option value={""}>Seleccionar Tipo</option>
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
              <Button
                variant="secondary"
                onClick={() => setShowModalAct(false)}
              >
                Cerrar
              </Button>
              <Button variant="primary" onClick={handleAddActivity}>
                Agregar
              </Button>
            </Modal.Footer>
          </Modal>
          <Button onClick={savePlan}>
            {" "}
            {loading && <Spinner animation="grow" />}EDITAR
          </Button>
        </>
      )}
    </div>
  );
};

export default PlanEdit;
