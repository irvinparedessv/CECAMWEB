import axios from 'axios';
import API_BASE_URL from './apiConfig';
import { Rol } from '../types/Rol';

const RolService = {
  getAllRols: async () => {
    try {
      const response = await axios.get<Rol[]>(`${API_BASE_URL}/rols`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener roles:', error);
      throw error;
    }
  },

  insertRol: async (roleName: string) => {
    try {
      const response = await axios.post<Rol>(
        `${API_BASE_URL}/rols`,
        { roleName }
      );
      return response.data;
    } catch (error) {
      console.error('Error al insertar rol:', error);
      throw error;
    }
  },

  updateRol: async (rolId: number, roleName: string) => {
    try {
      const response = await axios.put<Rol>(
        `${API_BASE_URL}/rols/${rolId}`,
        { roleName }
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      throw error;
    }
  },

  deleteRol: async (rolId: number) => {
    try {
      await axios.delete<void>(`${API_BASE_URL}/rols/${rolId}`);
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      throw error;
    }
  },
};

export default RolService;
