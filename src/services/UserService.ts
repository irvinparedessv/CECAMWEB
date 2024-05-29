// UserService.ts

import axios from 'axios';
import API_BASE_URL from './apiConfig'; // Importa la URL base de la API
import { User, UserInformation } from '../types';
import AuthService from './AuthService';

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

  // uploadPhoto: async (formData: FormData): Promise<UserInformation> => {
  //   try {
  //     const response = await axios.post<UserInformation>(`${API_BASE_URL}/uploadPhoto`, formData, {
  //       headers: {
  //         'Accept': 'application/json',
  //       },
  //     });

  //     return response.data;
  //   } catch (error) {
  //     console.error('Error al cargar la foto:', error);
  //     throw error;
  //   }
  // },

  uploadPhoto: async (formData: FormData): Promise<UserInformation> => {
    try {
      const token = AuthService.getToken(); // Obtener el token

      const response = await axios.post<UserInformation>(`${API_BASE_URL}/uploadPhoto`, formData, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // Asegúrate de enviar el token en los encabezados
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al cargar la foto:', error);
      throw error;
    }
  },
  // Otros métodos para otras operaciones CRUD si es necesario
};

export default UserService;

