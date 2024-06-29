// // AuthService.ts

// import axios from 'axios';
// import API_BASE_URL from './apiConfig'; // Importa la URL base de la API
// import { LoginResponse } from '../types';

// const AuthService = {
// loginUser: async (email: string, password: string): Promise<LoginResponse> => {
//     try {
//       const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login-web`, {
//         email,
//         password,
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error al iniciar sesión:', error);
//       throw error;
//     }
//   }
// };

// export default AuthService;

// AuthService.ts
// import axios from 'axios';
// import API_BASE_URL from './apiConfig'; // Importa la URL base de la API
// import { LoginResponse } from '../types';

// const AuthService = {
//   loginUser: async (email: string, password: string): Promise<LoginResponse> => {
//     try {
//       const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login-web`, {
//         email,
//         password,
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error al iniciar sesión:', error);
//       throw error;
//     }
//   }
// };

// export default AuthService;

// import axios from 'axios';
// import API_BASE_URL from './apiConfig'; // Asegúrate de que la ruta es correcta
// import { LoginResponse } from '../types'; // Importa la interfaz desde donde la hayas definido

// const AuthService = {
//   loginUser: async (emailOrUsername: string, password: string): Promise<LoginResponse> => {
//     try {
//       const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login-web`, {
//         emailOrUsername,
//         password,
//       });
//       return response.data ? response.data : { success: false, message: 'No data returned' };
//     } catch (error) {
//       console.error('Error al iniciar sesión:', error);
//       throw error;
//     }
//   }

// };

// export default AuthService;

import axios from "axios";
import API_BASE_URL from "./apiConfig"; // Asegúrate de que la ruta es correcta
import { LoginResponse, UserInformation } from "../types"; // Importa las interfaces desde donde las hayas definido

const AuthService = {
  loginUser: async (
    emailOrUsername: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/login-web`,
        {
          emailOrUsername,
          password,
        }
      );
      return response.data
        ? response.data
        : { success: false, message: "No data returned" };
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  },

  /*getUserDetails: async (): Promise<UserInformation> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');

      const response = await axios.get<UserInformation>(`${API_BASE_URL}/user-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al obtener los detalles del usuario:', error);
      throw error;
    }
  },*/

  getUserDetails: async (): Promise<UserInformation> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token de autenticación");

      const response = await axios.get<{
        success: boolean;
        data: UserInformation;
      }>(`${API_BASE_URL}/user-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al obtener los detalles del usuario:", error);
      throw error;
    }
  },

  changeTemporalPassword: async (
    userId: number,
    newPassword: string
  ): Promise<boolean> => {
    try {
      const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");
      if (!token) throw new Error("No hay token de autenticación");

      const response = await axios.post<{ success: boolean }>(
        `${API_BASE_URL}/change-temporal-password/${userId}`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.success;
    } catch (error) {
      console.error("Error al cambiar la contraseña temporal:", error);
      throw error;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },
  validateToken: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/validate-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },
};

export default AuthService;
