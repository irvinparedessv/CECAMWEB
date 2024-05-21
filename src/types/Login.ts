export interface Login {
  usernames: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: UserInformation;
  token: string;
  message?: string;
}

// export interface UserInformation {
//   id: number;
//   email: string;
//   name: string;
//   lastName: string;
// }

export interface UserInformation {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}


