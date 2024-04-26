import axios from 'axios';
import API_BASE_URL from './apiConfig';
import { Student } from '../types';
import { Rol } from '../types/Rol';

const StudentService = {
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
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  },
  
};

export default StudentService;
