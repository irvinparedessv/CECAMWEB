export interface Period {
  periodId: number;
  name: string;
  start_date: string | null;
  end_date: string | null;
  typePeriodId: number;
  percentage: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Subject {
  subjectId: number;
  subjectName: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  activityId: number;
  percentage: string;
  description: string;
  dueDate: string;
  created_at: string;
  updated_at: string;
  planId: number;
  periodId: number;
  subjectId: number;
  typeId: number;
  period: Period;
  subject: Subject;
}

export interface Plan {
  planId: number;
  name: string;
  isDetail: boolean;
  typePeriodId: number;
  created_at: string | null;
  updated_at: string | null;
  activities: Activity[];
}
