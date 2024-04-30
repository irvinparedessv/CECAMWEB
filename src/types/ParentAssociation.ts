export interface ParentAssociation {
    id: number;
    firstName: string;
    lastName: string;
    parentId: number;
    studentId: number;
    // studentId: number;
  }

export interface Count{
  id: number;
  firstName: string;
  lastName: string;
  padres: number;
}