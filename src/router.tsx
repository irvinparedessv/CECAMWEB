// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
//   Outlet,
// } from "react-router-dom";
// import { Navbar } from "./components/Navbar";
// import { Register } from "./views/Register";
// import { Grade } from "./views/Grade";
// import { Subject } from "./views/Subject";
// //import { Students } from "./views/Students";
// import { Students } from "./views/Students";
// import { Attendance } from "./views/Attendance";
// import { Teacher } from "./views/Teacher";
// import { Observation } from "./views/Observations";
// import { MiGrade } from "./views/MiGrade";
// import { ReportGrade } from "./views/ReportGrade";
// import { Rols } from "./views/Rols";
// import LoginForm from "./views/Login/Login";
// import { Parents } from "./views/Parents";
// import { ParentAssociations } from "./views/ParentAssociations";
// import { Toaster } from "react-hot-toast";
// import { GradeForm, GradeList, GradeEdit } from "./views/Grade";
// import { StudentsGrade } from "./views/StudentsGrade";

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     !!localStorage.getItem("token")
//   );

//   useEffect(() => {
//     // Verificar si hay un token de sesión almacenado
//     const token = localStorage.getItem("token");
//     if (token) {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const AuthGuard = () => {
//     if (!isAuthenticated) {
//       return <Navigate to="/login" replace />;
//     }
//     return <Outlet />;
//   };

//   const logout = () => {
//     // Eliminar el token de sesión almacenado
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//   };

//   const login = () => {
//     // Establecer la autenticación como verdadera y redirigir al usuario a la página de estudiantes
//     setIsAuthenticated(true);
//     return <Navigate to="/students" replace />;
//   };

//   const notasEjemplo = [
//     { materia: "Matemáticas", nota: 9.0 },
//     { materia: "Ciencias", nota: 8.5 },
//     { materia: "Historia", nota: 8.0 },
//     { materia: "Lenguaje", nota: 7.0 },
//     { materia: "Educacion", nota: 8.0 },
//   ];

//   return (
//     <Router>
//       {isAuthenticated && <Navbar logout={logout} />}
//       <div className="col py-3">
//         <Toaster
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: "#363636",
//               color: "#fff",
//             },
//           }}
//           position="top-center"
//         />
//         <Routes>
//           {/* Public routes */}
          
//           <Route path="/" element={<LoginForm login={login} />} />
//           <Route path="/login" element={<LoginForm login={login} />} />
          
//           {/* Protected routes */}
//           <Route element={<AuthGuard />}>
//             <Route path="/students" element={<Students />} />
//             <Route path="/rols" element={<Rols />} />
//             <Route path="/parents" element={<Parents />} />
//             <Route path="/parentAssociations" element={<ParentAssociations />} />

//             <Route path="/register-student" element={<Register />} />
//             <Route path="/grades" element={<GradeList />} />
//             <Route path="/grades/add" element={<GradeForm />} />
//             <Route path="/students/grade/:id" element={<StudentsGrade />} />
//             <Route path="/register-subjects" element={<Subject />} />
//             <Route path="/register-teachers" element={<Teacher />} />
//             <Route path="/subjects" element={<Subject />} />
//             <Route path="/grades/edit/:id" element={<GradeEdit />} />
//             <Route path="/attendances" element={<Attendance />} />
//             <Route
//               path="/notes"
//               element={
//                 <ReportGrade
//                   estudiante="Irvin Paredes"
//                   grado="7-A"
//                   key={"ds"}
//                   notas={notasEjemplo}
//                 />
//               }
//             />
//             <Route path="/observations" element={<Observation />} />
//             <Route path="/migrades" element={<MiGrade />} />
//           </Route>
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;

// import React, { useEffect, useState, ReactElement } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
//   Outlet,
// } from "react-router-dom";
// import { Navbar } from "./components/Navbar";
// import { Register } from "./views/Register";
// import { Grade } from "./views/Grade";
// import { Subject } from "./views/Subject";
// import { Students } from "./views/Students";
// import { Attendance } from "./views/Attendance";
// import { Teacher } from "./views/Teacher";
// import { Observation } from "./views/Observations";
// import { MiGrade } from "./views/MiGrade";
// import { ReportGrade } from "./views/ReportGrade";
// import { Rols } from "./views/Rols";
// import LoginForm from "./views/Login/Login";
// import { Parents } from "./views/Parents";
// import { ParentAssociations } from "./views/ParentAssociations";
// import { Toaster } from "react-hot-toast";
// import { GradeForm, GradeList, GradeEdit } from "./views/Grade";
// import { StudentsGrade } from "./views/StudentsGrade";
// import { AdminDashboard, ProfessorDashboard } from "./views/Dashboard";

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     !!localStorage.getItem("token")
//   );

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const AuthGuard = () => {
//     if (!isAuthenticated) {
//       return <Navigate to="/login" replace />;
//     }
//     return <Outlet />;
//   };

//   interface PublicRouteProps {
//     element: ReactElement;
//   }


//   //SI QUIERE INGRESAR AL LOGIN ALGUIEN CON SESION ABIERTA REDIRECCIONA A LA PAGINA DE NAVIGATE
//   const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
//     return isAuthenticated ? <Navigate to="/students" replace /> : element;
//   };


//   // const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
//   //   const userInfo = localStorage.getItem("userInfo");
//   //   if (userInfo) {
//   //     const { roleName } = JSON.parse(userInfo);
//   //     if (roleName === "Administrador") {
//   //       return <Navigate to="/adminDashboard" replace />;
//   //     } else if (roleName === "Profesor") {
//   //       return <Navigate to="/professorDashboard" replace />;
//   //     }
//   //   }
    
//   //   return isAuthenticated ? <Navigate to="/students" replace /> : element;
//   // };
  

//   const logout = () => {
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//   };

//   // const login = () => {
//   //   setIsAuthenticated(true);
//   //   return <Navigate to="/students" replace />;
//   // };

//   const login = () => {
//     const userInfo = localStorage.getItem("userInfo");
//     if (userInfo) {
//       const { roleName } = JSON.parse(userInfo);
//       setIsAuthenticated(true);
//       // setRoleName(roleName); // ¡Este setRoleName estaba causando el error!
//       if (roleName === "Administrador") {
//         return <Navigate to="/adminDashboard" replace />;
//       } else if (roleName === "Profesor") {
//         return <Navigate to="/professorDashboard" replace />;
//       }
//     }
//   };
  
  
//   const notasEjemplo = [
//     { materia: "Matemáticas", nota: 9.0 },
//     { materia: "Ciencias", nota: 8.5 },
//     { materia: "Historia", nota: 8.0 },
//     { materia: "Lenguaje", nota: 7.0 },
//     { materia: "Educacion", nota: 8.0 },
//   ];

//   return (
//     <Router>
//       {isAuthenticated && <Navbar logout={logout} />}
//       <div className="col py-3">
//         <Toaster
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: "#363636",
//               color: "#fff",
//             },
//           }}
//           position="top-center"
//         />
//         <Routes>
//           {/* Public routes */}
//           <Route
//             path="/login"
//             element={<PublicRoute element={<LoginForm login={login} />} />}
//           />
//           <Route
//             path="/"
//             element={<PublicRoute element={<LoginForm login={login} />} />}
//           />
          
//           {/* Protected routes */}
//           <Route element={<AuthGuard />}>
//             <Route path="/students" element={<Students />} />
//             <Route path="/rols" element={<Rols />} />
//             <Route path="/parents" element={<Parents />} />
//             <Route path="/parentAssociations" element={<ParentAssociations />} />
//             <Route path="/register-student" element={<Register />} />
//             <Route path="/grades" element={<GradeList />} />
//             <Route path="/grades/add" element={<GradeForm />} />
//             <Route path="/students/grade/:id" element={<StudentsGrade />} />
//             <Route path="/register-subjects" element={<Subject />} />
//             <Route path="/register-teachers" element={<Teacher />} />
//             <Route path="/subjects" element={<Subject />} />
//             <Route path="/grades/edit/:id" element={<GradeEdit />} />
//             <Route path="/attendances" element={<Attendance />} />
//             <Route path="/adminDashboard" element={<AdminDashboard />} />
//             <Route path="/professorDashboard" element={<ProfessorDashboard />} />
//             <Route
//               path="/notes"
//               element={
//                 <ReportGrade
//                   estudiante="Irvin Paredes"
//                   grado="7-A"
//                   key={"ds"}
//                   notas={notasEjemplo}
//                 />
//               }
//             />
//             <Route path="/observations" element={<Observation />} />
//             <Route path="/migrades" element={<MiGrade />} />
//           </Route>
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;


import React, { useEffect, useState, ReactElement } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Register } from "./views/Register";
import { Grade } from "./views/Grade";
import { Subject } from "./views/Subject";
import { Students } from "./views/Students";
import { Attendance } from "./views/Attendance";
import { Teacher } from "./views/Teacher";
import { Observation } from "./views/Observations";
import { MiGrade } from "./views/MiGrade";
import { ReportGrade } from "./views/ReportGrade";
import { Rols } from "./views/Rols";
import LoginForm from "./views/Login/Login";
import { Parents } from "./views/Parents";
import { ParentAssociations } from "./views/ParentAssociations";
import { Toaster } from "react-hot-toast";
import { GradeList} from "./views/Grade";
import { StudentsGrade } from "./views/StudentsGrade";
import { AdminDashboard, ProfessorDashboard } from "./views/Dashboard";

interface PublicRouteProps {
  element: ReactElement;
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const { roleName } = JSON.parse(userInfo);
      setRoleName(roleName);
    }
  }, [isAuthenticated]);

  const AuthGuard = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <Outlet />;
  };


  //se verifica si es admin o profesor y redirige a la pagina adecuadada, si no es ninguno envia al login
  const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
    if (isAuthenticated) {
      if (roleName === "Administrador") {
        return <Navigate to="/adminDashboard" replace />;
      } else if (roleName === "Profesor") {
        return <Navigate to="/professorDashboard" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    } else {
      return element;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setRoleName("");
  };

  const login = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const { roleName } = JSON.parse(userInfo);
      setIsAuthenticated(true);
      setRoleName(roleName);
      if (roleName === "Administrador") {
        return <Navigate to="/adminDashboard" replace />;
      } else if (roleName === "Profesor") {
        return <Navigate to="/professorDashboard" replace />;
      }
    }
  };

  const notasEjemplo = [
    { materia: "Matemáticas", nota: 9.0 },
    { materia: "Ciencias", nota: 8.5 },
    { materia: "Historia", nota: 8.0 },
    { materia: "Lenguaje", nota: 7.0 },
    { materia: "Educacion", nota: 8.0 },
  ];

  return (
    <Router>
      {isAuthenticated && <Navbar logout={logout} />}
      <div className="col py-3">
        <Toaster
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
          position="top-center"
        />
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={<PublicRoute element={<LoginForm login={login} />} />}
          />
          <Route
            path="/"
            element={<PublicRoute element={<LoginForm login={login} />} />}
          />
          
          {/* Protected routes */}
          <Route element={<AuthGuard />}>
            <Route path="/students" element={<Students />} />
            <Route path="/rols" element={<Rols />} />
            <Route path="/parents" element={<Parents />} />
            <Route path="/parentAssociations" element={<ParentAssociations />} />
            <Route path="/register-student" element={<Register />} />
            <Route path="/grades" element={<GradeList />} />
            {/* <Route path="/grades/add" element={<GradeForm />} /> */}
            <Route path="/students/grade/:id" element={<StudentsGrade />} />
            <Route path="/register-subjects" element={<Subject />} />
            <Route path="/register-teachers" element={<Teacher />} />
            <Route path="/subjects" element={<Subject />} />
            {/* <Route path="/grades/edit/:id" element={<GradeEdit />} /> */}
            <Route path="/attendances" element={<Attendance />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/professorDashboard" element={<ProfessorDashboard />} />
            <Route
              path="/notes"
              element={
                <ReportGrade
                  estudiante="Irvin Paredes"
                  grado="7-A"
                  key={"ds"}
                  notas={notasEjemplo}
                />
              }
            />
            <Route path="/observations" element={<Observation />} />
            <Route path="/migrades" element={<MiGrade />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;