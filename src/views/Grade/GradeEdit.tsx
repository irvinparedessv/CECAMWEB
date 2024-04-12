import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GradeService from "../../services/GradeService";
import { Grade } from "../../types";
import toast from "react-hot-toast";

interface RouteParams {
  id: string;
  [key: string]: string | undefined; // Añadir firma de índice
}

function GradeEdit() {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();

  const [formData, setFormData] = useState<Grade>({
    gradeId: Number(id),
    name: "",
    section: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const response = await GradeService.getGradeById(Number(id));
        console.log(response);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching grade:", error);
      }
    };
    fetchGrade();
  }, [id]);
  const handleCancel = () => {
    navigate("/grades");
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar campos requeridos
    const newErrors: { [key: string]: string } = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value.toString().trim() === "") {
        newErrors[key] =
          `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const updatedGrade: Grade = {
        ...formData,
        gradeId: Number(id),
      };
      console.log(updatedGrade);
      toast.promise(GradeService.updateGrade(updatedGrade), {
        loading: "Saving...",
        success: <b>Grado modificado!</b>,
        error: <b>Error en guardado.</b>,
      });
      setTimeout(() => {
        navigate("/grades");
      }, 1000);
    } catch (error) {
      console.error("Error updating grade:", error);
    }
  };

  return (
    <div>
      <h1>Edit Grade</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            className="form-control"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label>Seccion</label>
          <input
            className="form-control"
            type="text"
            name="section"
            placeholder="Section"
            value={formData.section}
            onChange={handleChange}
            required
          />
          {errors.section && (
            <div className="error-message">{errors.section}</div>
          )}
        </div>
        <div className="form-group">
          <label>Descripcion</label>
          <input
            className="form-control"
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
        </div>
        <div className="row">
          <div className="col-1">
            <button className="btn btn-primary" type="submit">
              Editar
            </button>
          </div>
          <div className="col-1">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default GradeEdit;
