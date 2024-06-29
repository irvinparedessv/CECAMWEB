import { GeneralResponse } from "./General";
import { Grade, GradeStudents } from "./Grade";
import { PaginationType } from "./Paginations";

export interface Student {
  id: number;
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  userPhoto: string;
  rolId: number;
  gradeId: number;
  parents?: Parentx[];
}
export interface Parentx extends Student {}

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
  pagination: PaginationType;
}
export interface StudentsAbsencesResponse extends GeneralResponse {
  data: {
    students: StudentsAbsences[];
    grade: Grade;
  };
  pagination: PaginationType;
}
export interface StudentsAbsences {
  id: number;
  userName: string;
  email: string;
  email_verified_at: string | null; // Puede ser una cadena o nulo
  created_at: string; // Fecha y hora en formato ISO 8601
  updated_at: string; // Fecha y hora en formato ISO 8601
  pushToken: string | null; // Puede ser una cadena o nulo
  firstName: string;
  lastName: string;
  enabled: boolean;
  rolId: number;
  userPhoto: string | null; // Puede ser una cadena o nulo
  absences: Absence[]; // Array de ausencias, puedes definir un tipo específico si es necesario
}
export interface Absence {
  id: number;
  studentId: number;
  professorId: number;
  date: string; // Se asume que la fecha es un string ISO 8601
  created_at: string; // También se asume que la fecha de creación es un string ISO 8601
  updated_at: string; // Y la fecha de actualización es un string ISO 8601
  comment: string;
  hasPermission: boolean;
}
