// UserService.ts

import axios from 'axios';
import API_BASE_URL from './apiConfig'; // Importa la URL base de la API
import { User } from '../types';

const UserService = {
  getAllUsers: async () => {
    try {
      const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },
  // Otros métodos para otras operaciones CRUD si es necesario
};

export default UserService;

