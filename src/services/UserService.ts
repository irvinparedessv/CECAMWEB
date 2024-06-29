// UserService.ts

import axios, { AxiosError } from 'axios';
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

  changePassword: async (userId: number, currentPassword: string, newPassword: string): Promise<boolean> => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) throw new Error('No hay token de autenticación');

    try {
      const response = await axios.post<{ success: boolean }>(
        `${API_BASE_URL}/change-password/${userId}`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.success;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 401) {
        // No hacer nada aquí para evitar registro de error en la consola por 401
        return false; // Retornar falso para indicar que la operación no tuvo éxito
      } else {
        throw new Error('Ocurrió un error al intentar cambiar la contraseña.');
      }
    }
  },

  // Método para verificar la contraseña actual del usuario
  verifyPassword: async (userId: number, currentPassword: string): Promise<boolean> => {
    try {
      const response = await axios.post<{ success: boolean }>(
        `${API_BASE_URL}/verify-password/${userId}`,
        { currentPassword }
      );

      return response.data.success;
    } catch (error) {
      // console.error('Error al verificar contraseña:', error);
      // throw new Error('Ocurrió un error al verificar la contraseña.');
    }
  },

  






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

