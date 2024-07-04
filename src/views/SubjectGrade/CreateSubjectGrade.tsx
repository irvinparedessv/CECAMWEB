import React, { useEffect, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import GradeSubjectService from "../../services/GradeSubjectService";
import toast from "react-hot-toast";
import SubjectService from "../../services/SubjectService";
import { Grade, Professor, Subject } from "../../types";
import { Plan } from "../../types/Plans";

const CreateGradeSubject: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const editData = location.state?.gradeSubject;

  const [formData, setFormData] = useState({
    subjectId: editData?.subject.subjectId || "",
    gradeId: editData?.grade.gradeId || "",
    professorId: editData?.professor?.id || "",
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [subjectsData, gradesData, professorsData] = await Promise.all([
          SubjectService.getAllSubjects(),
          GradeSubjectService.getAllGrades(),
          GradeSubjectService.getAllProfessors(),
        ]);
        setSubjects(subjectsData);
        setGrades(gradesData);
        console.log(professorsData);
        setProfessors(professorsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.subjectId || !formData.gradeId || !formData.professorId) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    setLoading(true);

    try {
      if (editData) {
        // Lógica para actualizar
        await GradeSubjectService.editSubjectsGrade(
          editData.gradeSubjectId,
          formData
        );
        toast.success("Actualizado exitosamente");
        navigate("/subject-grade");
      } else {
        // Lógica para crear
        await GradeSubjectService.addSubjects(formData);
        toast.success("Agregado exitosamente");
        navigate("/subject-grade");
      }
      setFormData({
        subjectId: "",
        gradeId: "",
        professorId: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}
      {!loading && (
        <>
          <Form.Group>
            <Form.Label>Materia:</Form.Label>
            <Form.Control
              as="select"
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una materia</option>
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Grado:</Form.Label>
            <Form.Control
              as="select"
              name="gradeId"
              value={formData.gradeId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un grado</option>
              {grades.map((grade) => (
                <option key={grade.gradeId} value={grade.gradeId}>
                  {grade.name} - {grade.section}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Profesor:</Form.Label>
            <Form.Control
              as="select"
              name="professorId"
              value={formData.professorId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un profesor</option>
              {professors.map((professor) => (
                <option key={professor.id} value={professor.id}>
                  {professor.firstName} {professor.lastName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Button type="submit">
            {editData ? "Actualizar Materia" : "Crear Materia"}
          </Button>
        </>
      )}
    </Form>
  );
};

export default CreateGradeSubject;
