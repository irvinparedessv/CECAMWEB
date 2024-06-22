export interface Student {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
}

export interface Note {
  id: number;
  activityId: number;
  studentId: number;
  note: string;
  student: Student;
  notePeriod: number;
}
export interface Activity {
  activityId: number;
  description: string;
}

export interface NotesStudents {
  activity: Activity;
  notes: Note[];
}
