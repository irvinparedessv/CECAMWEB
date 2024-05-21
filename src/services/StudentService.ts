import { Student } from '../types';
import { Rol } from '../types/Rol';
import axios, { AxiosInstance } from "axios";
import API_BASE_URL from "./apiConfig"; // Importa la URL base de la API
 
import { StudentsResponse } from "../types/Student";
import { GeneralResponse } from "../types";
import { itemsPerPage } from '../const/Pagination';
const TOKEN_HEADER = "X-AUTH-TOKEN";
const ACCOUNT_ID = "X-ACCOUNT-ID";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    [TOKEN_HEADER]: localStorage.getItem("token"),
    [ACCOUNT_ID]: localStorage.getItem("userId"),
  },
});

const StudentService = {

  getAll: async (page: number, search: string) => {

    try {
      const response = await axiosInstance.post<StudentsResponse>(

        `${API_BASE_URL}/students/search?page=${page}&itemsperpage=${itemsPerPage}`,

        { search }

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
  getAllUsers: async () => {
    try {
      const response = await axios.get<Student[]>(`${API_BASE_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  getAllRols: async () => {
    try {
      const response = await axios.get<Rol[]>(`${API_BASE_URL}/rols`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener roles:', error);
      throw error;
    }
  },

  insertUser: async (userData: Student) => {
    try {
      const response = await axios.post<Student>(`${API_BASE_URL}/users`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al insertar usuario:', error);
      throw error;
    }
  },
  
  updateUser: async (userId: number, userData: Student) => {
    try {
      const response = await axios.put<Student>(`${API_BASE_URL}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },
  deleteUser: async (userId: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  },
  updateEnabled: async (studentId:number, newEnabledValue:boolean) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${studentId}/enabled`, {
        enabled: newEnabledValue,
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },

  updateParentsEnabled: async (studentId:number, parentIds: number[], newEnabledValue: boolean) => {
    try {
      // Agregar console.log para verificar los datos antes de enviar la solicitud
      //console.log('parentIds:', parentIds);
      //console.log('newEnabledValue:', newEnabledValue);
  
      const response = await axios.put(`${API_BASE_URL}/users/${studentId}/parentsEnabled`, {
        parentIds: parentIds,
        enabled: newEnabledValue,
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },
  
  

  getParentsWithSingleActiveChild: async (studentId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students/${studentId}/parentsWithSingleActiveChild`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener padres con un solo hijo activo:', error);
      throw error;
    }
  },

  checkEmailExists: async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-email?email=${email}`);
      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error('Error verificando si el correo existe:', error);
      throw error;
    }
  },
  
};

export default StudentService;
