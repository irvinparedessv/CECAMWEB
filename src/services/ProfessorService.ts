import { Student } from "../types";
import { Rol } from "../types/Rol";
import axios, { AxiosInstance } from "axios";
import API_BASE_URL from "./apiConfig"; // Importa la URL base de la API

import { StudentsResponse } from "../types/Student";
import { GeneralResponse } from "../types";
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

const ProfessorService = {
  getSubjects: async (professorId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/professor/${professorId}/subjects`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      throw error;
    }
  },
  getActivities: async (subjectId: string, gradeId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/activities/${subjectId}/${gradeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      throw error;
    }
  },
  studentsNoteByActivities: async (activityId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/activitiesstudents/${activityId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      throw error;
    }
  },
  updateStudentNote: async (
    activityId: number,
    studentId: number,
    data: { note: any }
  ) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/activities/${activityId}/students/${studentId}`,
        {
          data,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
};
export default ProfessorService;
