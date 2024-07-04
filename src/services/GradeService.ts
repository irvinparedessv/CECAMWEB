// GradeService.ts

import axios, { AxiosInstance } from "axios";
import API_BASE_URL from "./apiConfig"; // Importa la URL base de la API
import {
  Grade,
  GradeFormAdd,
  GradeProfessor,
  GradeProfessors,
  GradeResponse,
  GradeResponseOne,
  MiGradeResponse,
  Professor,
} from "../types";
import {
  StudentsGradeResponse,
  StudentsAbsences,
  StudentsAbsencesResponse,
} from "../types/Student";
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
  getAllGrades: async (params) => {
    try {
      const response = await axiosInstance.get<{
        success: boolean;
        data: { last_page: number; data: GradeProfessor[] };
      }>(`${API_BASE_URL}/grades`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
  getMyGrades: async (professorId: string) => {
    try {
      const response = await axiosInstance.get<MiGradeResponse>(
        `/migrades/${professorId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener grados:", error);
      throw error;
    }
  },

  //SE BUGUEA POR ESO LO PASE A ID DE UN SOLO YA QUE CON COUNTID ME LO TOMA PERO TENGO QUE RECARGAR LA PAGINA
  // getMyGrades: async (professorId: string) => {
  //   try {
  //     const response = await axiosInstance.get<MiGradeResponse>(`/migrades`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error al obtener grados:", error);
  //     throw error;
  //   }
  // },
  getStudents: async (id: number, page: number, query: string = "") => {
    try {
      const response = await axiosInstance.get<StudentsGradeResponse>(
        `${API_BASE_URL}/students/grade/${id}?page=${page}&itemsperpage=${itemsPerPage}&search=${query}`
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
      return response.data;
    } catch (error) {
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

  updateGrade: async (gradeId: number, grade: Grade) => {
    try {
      const response = await axiosInstance.put(
        `${API_BASE_URL}/grades/${gradeId}`,
        grade
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar grado:", error);
      throw error;
    }
  },
  // Otros métodos para otras operaciones CRUD si es necesario

  getAllGradeProfessors: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/gradeProfessors`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },

  getGradesWithProfessorAssociations: async (
    gradeId: number
  ): Promise<Professor[]> => {
    try {
      const response = await axios.get<Professor[]>(
        `${API_BASE_URL}/grades/professors/${gradeId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error al obtener usuarios con asociaciones de padres:",
        error
      );
      throw error;
    }
  },

  getUnassociatedProfessors: async (gradeId: number): Promise<Professor[]> => {
    try {
      const response = await axios.get<Professor[]>(
        `${API_BASE_URL}/grades/professorsUnassociated/${gradeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener padres no asociados:", error);
      throw error;
    }
  },
  getAbsences: async (gradeId: number) => {
    try {
      const response = await axios.get<StudentsAbsencesResponse>(
        `${API_BASE_URL}/absences/${gradeId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch absences");
    }
  },

  saveGradeProfessors: async (gradeId: number, professorId: number) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/gradeProfessors`, {
        gradeId,
        professorId,
      });
      return response.data;
    } catch (error) {
      console.error("Error al guardar la asociación de profesores:", error);
      throw error;
    }
  },

  deleteGradeProfessor: async (gradeId: number) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/gradeProfessors/${gradeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al eliminar la asociación de padres:", error);
      throw error;
    }
  },
  addActivity: async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/grade/addActivity`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al agregar actividad:", error);
      throw error;
    }
  },
};

export default GradeService;
