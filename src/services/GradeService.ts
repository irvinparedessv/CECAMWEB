// GradeService.ts

import axios from 'axios';
import API_BASE_URL from './apiConfig'; // Importa la URL base de la API
import { Grade, GradeFormAdd, GradeResponse, GradeResponseOne } from '../types';

const GradeService = {
  getAllGrades: async () => {
    try {
      const response = await axios.get<GradeResponse>(`${API_BASE_URL}/grades`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },
  addGrade: async (newGrade:GradeFormAdd) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/grades`, newGrade);
            return response.data;
        } catch (error) {
            // Manejar errores aquí si es necesario
            throw error;
        }
    },
  deleteGrade: async (id:number) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/grades/${id}`);
            console.log(response);
            return response.data;
        } catch (error) {
          console.log(error);
            // Manejar errores aquí si es necesario
            throw error;
        }
    },
     getGradeById: async (id: number) => {
        try {
            const response = await axios.get<GradeResponseOne>(`${API_BASE_URL}/grades/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener grado por ID:', error);
            throw error;
        }
    },

  updateGrade: async (grade: Grade) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/grades/${grade.gradeId}`, grade);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar grado:', error);
            throw error;
        }
    },
  // Otros métodos para otras operaciones CRUD si es necesario
};

export default GradeService;