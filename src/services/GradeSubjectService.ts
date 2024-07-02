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
import { Plan } from "../types/Plans";
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

const GradeSubjectService = {
  getGradesSubjects: async (page: number, search: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/gradesubjects?page=${page}&searchTerm=${search}&itemsPerPage=${itemsPerPage} `
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  addSubjects: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/gradesubjects`, {
        data: data,
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  deleteGradeSubject: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/gradesubjects/delete/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  editSubjectsGrade: async (id, data) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/gradesubjects/edit/${id}`,
        {
          data: data,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  getAllGrades: async () => {
    try {
      const response = await axios.get<Grade[]>(
        `${API_BASE_URL}/gradessubjects/grades`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener materias:", error);
      throw error;
    }
  },
  getAllPlans: async () => {
    try {
      const response = await axios.get<Plan[]>(
        `${API_BASE_URL}/gradessubjects/plans`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener plans:", error);
      throw error;
    }
  },
  getAllProfessors: async () => {
    try {
      const response = await axios.get<Professor[]>(
        `${API_BASE_URL}/gradessubjects/professors`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener profesores:", error);
      throw error;
    }
  },
};

export default GradeSubjectService;
