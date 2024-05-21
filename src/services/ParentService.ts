import axios from 'axios';
import API_BASE_URL from './apiConfig';
import { Parent } from '../types/Parent';
import { Rol } from '../types/Rol';

const ParentService = {
  getAllUsers: async () => {
    try {
      const response = await axios.get<Parent[]>(`${API_BASE_URL}/users`);
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

  insertUser: async (userData: Parent) => {
    try {
      const response = await axios.post<Parent>(`${API_BASE_URL}/users`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al insertar usuario:', error);
      throw error;
    }
  },
  
  updateUser: async (userId: number, userData: Parent) => {
    try {
      const response = await axios.put<Parent>(`${API_BASE_URL}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },
  deleteUser: async (userId: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/usersParent/${userId}`);
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

export default ParentService;
