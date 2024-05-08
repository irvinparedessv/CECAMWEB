
import { GeneralResponse } from "./General";
import { GradeStudents } from "./Grade";

export interface Student {
  id: number;
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  rolId: number;
  gradeId: number;
}

export interface ParentsData {
  id: number;
  padre_nombre: string;
  padre_apellido: string;
}

export interface StudentsGradeResponse extends GeneralResponse {
  data: GradeStudents;
}
 
export interface StudentsResponse extends GeneralResponse {
  data: Student[];
}
