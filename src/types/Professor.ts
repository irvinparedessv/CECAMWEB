export interface Professor {
    id: number;
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
    rolId: number;
  }

  export interface GradeProfessors{
    gradeId: number;
    name: string;
    section: string;
    description: string;
    firstName: string;
    lastName: string;
  }