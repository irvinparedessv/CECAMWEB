export interface GradeResponse {
    success: boolean,
    data:Grade[],
    message:string
}

export interface Grade {
    gradeId:number,
    name:string,
    section:string,
    description:string


}
export interface GradeFormAdd {
    name: string;
    section: string;
    description: string;
}


export interface GradeResponseOne {
    success: boolean,
    data:Grade,
    message:string
}

export interface UpdateGradeParams {
    id: number;
    updatedGrade: Grade;
}
