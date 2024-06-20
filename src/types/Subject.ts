export interface Subject {
  subjectId: number;
  subjectName: string;
  code: string;
  //created_at: string;
  //updated_at: string;
}

interface Activity {
  nombre: string;
  porcentaje: number;
}

interface Periods {
  periodo: string;
  actividades: Activity[];
}

interface SubjectPlan {
  nombre: string;
  periodos: Periods[];
}
