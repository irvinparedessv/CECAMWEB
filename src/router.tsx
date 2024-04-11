import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Register } from "./views/Register";
import { GradeForm, GradeList, GradeEdit } from "./views/Grade";
import { Subject } from "./views/Subject";
import { Students } from "./views/Students";
import { Attendance } from "./views/Attendance";
import { Teacher } from "./views/Teacher";
import { Observation } from "./views/Observations";
import { MiGrade } from "./views/MiGrade";
import { ReportGrade } from "./views/ReportGrade";
import { Login } from "./views/Login";
import { Toaster } from "react-hot-toast";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const AuthGuard = () => {
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      return <Navigate to="/login" replace />;
    }
    return <Outlet />;
  };

  const logout = () => {
    // Eliminar el token del localStorage
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const login = () => {
    setIsAuthenticated(true);
  };
  const notasEjemplo = [
    { materia: "Matemáticas", nota: 9.0 },
    { materia: "Ciencias", nota: 8.5 },
    { materia: "Historia", nota: 8.0 },
    { materia: "Lenguaje", nota: 7.0 },
    { materia: "Educacion", nota: 8.0 },
    // Add more subjects and grades as needed
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
          <Route path="/login" element={<Login login={login} />} />
          <Route element={<AuthGuard />}>
            <Route path="/register-student" element={<Register />} />

            <Route path="/grades" element={<GradeList />} />
            <Route path="/grades/add" element={<GradeForm />} />
            <Route path="/register-subjects" element={<Subject />} />
            <Route path="/register-teachers" element={<Teacher />} />
            <Route path="/subjects" element={<Subject />} />
            <Route path="/grades/edit/:id" element={<GradeEdit />} />
            <Route path="/students" element={<Students />} />
            <Route path="/attendances" element={<Attendance />} />
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
