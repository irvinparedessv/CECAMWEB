// GradeService.ts

import axios, { AxiosInstance } from "axios";
import API_BASE_URL from "./apiConfig"; // Importa la URL base de la API
import {
  Grade,
  GradeFormAdd,
  GradeResponse,
  GradeResponseOne,
  MiGradeResponse,
  Professor,
} from "../types";
import { StudentsGradeResponse } from "../types/Student";
import { itemsPerPage } from "../const/Pagination";
const TOKEN_HEADER = "X-AUTH-TOKEN";
const ACCOUNT_ID = "X-ACCOUNT-ID";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    [TOKEN_HEADER]: localStorage.getItem("token"),
    [ACCOUNT_ID]: localStorage.getItem("userId"),
  },
});

// Interceptar las solicitudes antes de enviarlas

const GradeService = {
  getAllGrades: async () => {
    try {
      const response = await axiosInstance.get<GradeResponse>(
        `${API_BASE_URL}/grades`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
  getMyGrades: async () => {
    try {
      const response = await axiosInstance.get<MiGradeResponse>(
        `${API_BASE_URL}/migrades`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
  getStudents: async (id: number,page:number) => {
    try {
      const response = await axiosInstance.get<StudentsGradeResponse>(
        `${API_BASE_URL}/students/grade/${id}?page=${page}&itemsperpage=${itemsPerPage}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
  addGrade: async (newGrade: GradeFormAdd) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/grades`,
        newGrade
      );
      return response.data;
    } catch (error) {
      // Manejar errores aquí si es necesario
      throw error;
    }
  },
  deleteGrade: async (id: number) => {
    try {
      const response = await axiosInstance.delete(
        `${API_BASE_URL}/grades/${id}`
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      // Manejar errores aquí si es necesario
      throw error;
    }
  },
  getGradeById: async (id: number) => {
    try {
      const response = await axiosInstance.get<GradeResponseOne>(
        `${API_BASE_URL}/grades/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener grado por ID:", error);
      throw error;
    }
  },

  updateGrade: async (grade: Grade) => {
    try {
      const response = await axiosInstance.put(
        `${API_BASE_URL}/grades/${grade.gradeId}`,
        grade
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar grado:", error);
      throw error;
    }
  },
  // Otros métodos para otras operaciones CRUD si es necesario

  getGradesWithProfessorAssociations: async (gradeId: number): Promise<Professor[]> => {
    try {
      const response = await axios.get<Professor[]>(`${API_BASE_URL}/grades/professors/${gradeId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios con asociaciones de padres:', error);
      throw error;
    }
  },

  getUnassociatedProfessors: async (gradeId: number): Promise<Professor[]> => {
    try {
      const response = await axios.get<Professor[]>(`${API_BASE_URL}/grades/professorsUnassociated/${gradeId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener padres no asociados:', error);
      throw error;
    }
  },

  saveGradeProfessors: async (gradeId: number, professorId: number) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/gradeProfessors`, {
        gradeId,
        professorId
      });
      return response.data;
    } catch (error) {
      console.error('Error al guardar la asociación de profesores:', error);
      throw error;
    }
  },

  deleteGradeProfessor: async (gradeId:number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/gradeProfessors/${gradeId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la asociación de padres:', error);
      throw error;
    }
  },
};

export default GradeService;
