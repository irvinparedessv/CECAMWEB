// export interface Login {
//   usernames: string;
//   password: string;
// }

// // export interface LoginResponse {
// //   success: boolean;
// //   data: UserInformation;
// //   token: string;
// //   message?: string;
// // }

// // export interface UserInformation {
// //   id: number;
// //   email: string;
// //   name: string;
// //   lastName: string;
// // }

// export interface UserInformation {
//   id: number;
//   userName: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: string;
// }

// export interface LoginResponse {
//   success: boolean;
//   data?: {
//     id: string;
//     email: string;
//     userName: string;
//     firstName: string;
//     lastName: string;
//     role: string;
//   };
//   token?: string;
//   message?: string;
// }



export interface Login {
  usernames: string;
  password: string;
}

export interface UserInformation {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  userPhoto: string; // Añadir el campo userPhoto
  rolId: number;
  changePassword?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data?: UserInformation; // Utilizar la interfaz UserInformation
  token?: string;
  message?: string;
}




