import { GeneralResponse } from "./General";
import { GradeStudents } from "./Grade";

export interface Student {
  id: number;
  name: string;
  lastName: string;
  isSubscribed: boolean;
  gradeId: number;
}

export interface StudentsGradeResponse extends GeneralResponse {
  data: GradeStudents;
}

export interface StudentsResponse extends GeneralResponse {
  data: Student[];
}
