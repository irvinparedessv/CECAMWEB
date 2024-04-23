import axios from 'axios';
import API_BASE_URL from './apiConfig';
import { Parent, ParentAssociation } from '../types';
import { User } from '../types';

const ParentAssociationService = {
  getAllUsers: async () => {
    try {
      const response = await axios.get<User[]>(`${API_BASE_URL}/parentAssociations`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  saveParentAssociations: async (studentId: number, selectedParents: number[]) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/parentAssociations`, {
        studentId,
        selectedParents
      });
      return response.data;
    } catch (error) {
      console.error('Error al guardar las asociaciones de padres:', error);
      throw error;
    }
  },
  

  getUsersWithParentCount: async (): Promise<User[]> => {
    try {
      const response = await axios.get<User[]>(`${API_BASE_URL}/users/with-parent-count`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios con el conteo de padres:', error);
      throw error;
    }
  },
  getUsersWithParentAssociations: async (studentId: number): Promise<ParentAssociation[]> => {
    try {
      const response = await axios.get<ParentAssociation[]>(`${API_BASE_URL}/parentAssociations/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios con asociaciones de padres:', error);
      throw error;
    }
  },

  deleteParentAssociation: async (parentId:number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/parentAssociations/${parentId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la asociación de padres:', error);
      throw error;
    }
  }
  

 
};

export default ParentAssociationService;
