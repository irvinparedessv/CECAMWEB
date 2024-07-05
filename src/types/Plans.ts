import { Subject } from "./Subject";

export interface TypePeriod {
  typePeriodId: number;
  typeName: string;
}

export interface Activity {
  typeId: number;
  typeName: string;
}

export interface Period {
  typePeriodId: number;
  periodId: string;
  name: string;
  percentage: number;
}

export interface ActivitySave {
  typeName?: string;
  dueDate?: Date | string;
  periodId?: string;
  typeId: string;
  description: string;
  percentage: number;
}

export interface PeriodoActividades {
  period: Period;
  totalPercentage: number;
  activities: ActivitySave[];
}

export interface SaveSubject {
  subject: Subject;
  periods: PeriodoActividades[];
}

export interface Plan {
  planId: number;
  name: string;
  isDetail: boolean;
  typePeriodId: number;
  type_period: typePeriod;
}

export interface typePeriod {
  typePeriod: number;
  typeName: string;
}
