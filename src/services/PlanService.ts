import { Student } from "../types";
import { Rol } from "../types/Rol";
import { Subject } from "../types";
import axios, { AxiosInstance } from "axios";
import API_BASE_URL from "./apiConfig"; // Importa la URL base de la API

import { StudentsResponse } from "../types/Student";
import { GeneralResponse } from "../types";
import { itemsPerPage } from "../const/Pagination";
import {
  Activity,
  Period,
  Plan,
  SaveSubject,
  TypePeriod,
} from "../types/Plans";
const TOKEN_HEADER = "X-AUTH-TOKEN";
const ACCOUNT_ID = "X-ACCOUNT-ID";
interface dataSave {
  namePlan: string;
  typePlan: string;
  isGlobal: string;
  subjects: SaveSubject[];
  subjectsGlobal: SaveSubject[];
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    [TOKEN_HEADER]: localStorage.getItem("token"),
    [ACCOUNT_ID]: localStorage.getItem("userId"),
  },
});

const PlanService = {
  getSubjects: async () => {
    try {
      const response = await axios.get<Subject[]>(`${API_BASE_URL}/subjects`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
  getPlans: async (params) => {
    try {
      const response = await axios.get<{
        data: {
          last_page: number;
          data: Plan[];
        };
      }>(`${API_BASE_URL}/plans/all`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
  getPlan: async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/plans/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
  getTypes: async () => {
    try {
      const response = await axios.get<TypePeriod[]>(
        `${API_BASE_URL}/plans/typeperiods`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
  getActivities: async () => {
    try {
      const response = await axios.get<Activity[]>(
        `${API_BASE_URL}/plans/activities`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
  getPeriods: async () => {
    try {
      const response = await axios.get<Period[]>(
        `${API_BASE_URL}/plans/periods`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
  savePlan: async (data: dataSave) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/plans/save`, {
        data,
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
  editPlan: async (data: dataSave) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/plans/edit`, {
        data,
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
};
export default PlanService;
