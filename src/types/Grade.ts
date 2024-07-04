import { PaginationType } from "./Paginations";
import { Student } from "./Student";

export interface GradeResponse {
  success: boolean;
  data: Grade[];
  message: string;
}
export interface MiGradeResponse {
  success: boolean;
  data: MiGradeData[];
  message: string;
}

export interface Grade {
  gradeId: number;
  name: string;
  section: string;
  description: string;
}

export interface GradeProfessor {
  gradeId: number;
  name: string;
  section: string;
  description: string;
  manager_professor?: Student;
  year: number;
  planId?: string;
}

export interface GradeStudents {
  grade: Grade;
  students: Student[];
  pagination: PaginationType;
}

export interface MiGradeData {
  id: number;
  grade: Grade;
  students: number;
}

export interface GradeFormAdd {
  gradeId: number;
  name: string;
  section: string;
  description: string;
  year: number;
}

export interface GradeResponseOne {
  success: boolean;
  data: Grade;
  message: string;
}

export interface UpdateGradeParams {
  id: number;
  updatedGrade: Grade;
}
