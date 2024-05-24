import axios from 'axios';
import API_BASE_URL from './apiConfig';
import { Subject } from '../types';

const SubjectService = {
  getAllSubjects: async () => {
    try {
      const response = await axios.get<Subject[]>(`${API_BASE_URL}/subjects`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener materias:', error);
      throw error;
    }
  },

  createSubject: async (subjectName: string, code: string) => {
    try {
      const response = await axios.post<Subject>(
        `${API_BASE_URL}/subjects`,
        { subjectName, code }
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear materia:', error);
      throw error;
    }
  },

  updateSubject: async (subjectId: number, subjectName: string, code: string) => {
    try {
      const response = await axios.put<Subject>(
        `${API_BASE_URL}/subjects/${subjectId}`,
        { subjectName, code }
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar materia:', error);
      throw error;
    }
  },

  deleteSubject: async (subjectId: number) => {
    try {
      await axios.delete<void>(`${API_BASE_URL}/subjects/${subjectId}`);
    } catch (error) {
      console.error('Error al eliminar materia:', error);
      throw error;
    }
  },
};

export default SubjectService;
