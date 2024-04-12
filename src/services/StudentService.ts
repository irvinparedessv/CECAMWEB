// GradeService.ts

import axios, { AxiosInstance } from "axios";
import API_BASE_URL from "./apiConfig"; // Importa la URL base de la API

import { StudentsResponse } from "../types/Student";
import { GeneralResponse } from "../types";
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

const StudentService = {
  getAll: async (page: number, search: string) => {
    try {
      const response = await axiosInstance.post<StudentsResponse>(
        `${API_BASE_URL}/students/search`,
        { page, search }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
  enroll: async (studentId: number, gradeId: number) => {
    try {
      const response = await axiosInstance.post<GeneralResponse>(
        `${API_BASE_URL}/students/enroll`,
        { studentId, gradeId }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
};

export default StudentService;
