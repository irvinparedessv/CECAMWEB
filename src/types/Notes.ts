export interface Student {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
}
export interface StudentGrade {
  created_at: string | null;
  gradeId: number;
  id: number;
  isActive: boolean;
  student: Student;
  studentId: number;
  updated_at: string | null;
  year: number;
}
export interface Note {
  id: number;
  activityId: number;
  studentId: number;
  note: string;
  notePeriod: number;
}
export interface NoteStudentGrade {
  student: StudentGrade;
  note?: Note;
}
export interface NoteStudent {
  student: Student;
  note: Note;
}
export interface Activity {
  activityId: number;
  description: string;
}

export interface NotesStudents {
  activity: Activity;
  notes: NoteStudentGrade[];
}
