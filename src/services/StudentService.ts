import axios from 'axios';
import API_BASE_URL from './apiConfig';
import { Student } from '../types';

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

  insertUser: async (userData: any) => { // Puedes ajustar el tipo de userData según la estructura de tus datos
    try {
      const response = await axios.post<Student>(
        `${API_BASE_URL}/users`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error('Error al insertar usuario:', error);
      throw error;
    }
  },
};

export default StudentService;
