import React, { useState, ChangeEvent, FormEvent } from "react";
import GradeService from "../../services/GradeService";
import { GradeFormAdd } from "../../types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function GradeForm() {
  const [formData, setFormData] = useState<GradeFormAdd>({
    name: "",
    section: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    navigate("/grades");
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar campos requeridos
    const newErrors: { [key: string]: string } = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim() === "") {
        newErrors[key] =
          `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      toast.promise(GradeService.addGrade(formData), {
        loading: "Guardando...",
        success: <b>Grado guardado!</b>,
        error: <b>Error en guardado.</b>,
      });
      setTimeout(() => {
        navigate("/grades");
      }, 1000);
    } catch (error) {
      console.error("Error creating grade:", error);
    }
  };

  return (
    <div>
      <h1>AGREGAR GRADO</h1>
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
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isLoading}
            >
              Agregar
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

export default GradeForm;
