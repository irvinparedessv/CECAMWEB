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
import axios from 'axios';
import API_BASE_URL from './apiConfig'; // Importa la URL base de la API
import { LoginResponse } from '../types';

const AuthService = {
  loginUser: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login-web`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }
};

export default AuthService;



