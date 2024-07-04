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
import { Observation } from "./views/Observations";
import { MiGrade } from "./views/MiGrade";
import { ReportGrade } from "./views/ReportGrade";
import { Rols } from "./views/Rols";
import LoginForm from "./views/Login/Login";
import { Parents } from "./views/Parents";
import { ParentAssociations } from "./views/ParentAssociations";
import { Toaster } from "react-hot-toast";
import { GradeList } from "./views/Grade";
import { StudentsGrade } from "./views/StudentsGrade";
import { AdminDashboard, ProfessorDashboard } from "./views/Dashboard";
import { Profiles } from "./views/Profiles";
import StudyPlan from "./views/StudyPlan/StudyPlan";
import ListPlan from "./views/StudyPlan/ListPlan";
import PlanEdit from "./views/StudyPlan/PlanEdit";
import ProfessorSubjects from "./views/Professor/subjects/ProfessorSubjects";
import AuthService from "./services/AuthService";
import SubjectGradeList from "./views/SubjectGrade/SubjectGradeList";
import CreateGradeSubject from "./views/SubjectGrade/CreateSubjectGrade";
import AuthGuard from "./components/Auth/AuthGuard";
import NoAuthorized from "./components/Auth/NoAuthorize";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await AuthService.validateToken(token);
          if (response.data && response.data.isvalid) {
            setIsAuthenticated(true);
          } else {
            localStorage.clear();
          }
        } catch (error) {
          console.error("Invalid token", error);
          setIsAuthenticated(false);
          localStorage.removeItem("token");
        }
      }
    };
    validateToken();
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const { roleName } = JSON.parse(userInfo);
      setRoleName(roleName);
    }
  }, [isAuthenticated]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setIsAuthenticated(false);
    setRoleName("");
    return <Navigate to="/login" replace />;
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

  const PublicRoute = ({ element }) => {
    if (isAuthenticated) {
      if (roleName === "Administrador") {
        return <Navigate to="/adminDashboard" replace />;
      } else if (roleName === "Profesor") {
        return <Navigate to="/professorDashboard" replace />;
      }
    }
    return element;
  };

  return (
    <Router basename="/app">
      {isAuthenticated && <Navbar logout={logout} />}
      <div className="col py-3 maincontainer">
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

          <Route
            element={
              <AuthGuard
                isAuthenticated={isAuthenticated}
                roleName={roleName}
                allowedRoles={["Administrador", "Profesor"]}
              />
            }
          >
            <Route path="/unauthorized" element={<NoAuthorized />} />
            <Route
              path="/parentAssociations"
              element={<ParentAssociations />}
            />
          </Route>
          {/* Protected routes */}
          <Route
            element={
              <AuthGuard
                isAuthenticated={isAuthenticated}
                roleName={roleName}
                allowedRoles={["Administrador"]}
              />
            }
          >
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/plans" element={<ListPlan />} />
            <Route path="/plans/add" element={<StudyPlan />} />
            <Route path="/plans/edit/:id" element={<PlanEdit />} />
            <Route path="/students" element={<Students />} />
            <Route path="/rols" element={<Rols />} />
            <Route path="/parents" element={<Parents />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/register-student" element={<Register />} />
            <Route path="/grades" element={<GradeList />} />
            <Route path="/students/grade/:id" element={<StudentsGrade />} />
            <Route path="/register-subjects" element={<Subject />} />
            <Route path="/subjects" element={<Subject />} />

            <Route path="/subject-grade" element={<SubjectGradeList />} />
            <Route path="/subject-grade-add" element={<CreateGradeSubject />} />

            <Route path="/attendance/grade/:id" element={<Attendance />} />
            <Route path="/observations" element={<Observation />} />
          </Route>

          <Route
            element={
              <AuthGuard
                isAuthenticated={isAuthenticated}
                roleName={roleName}
                allowedRoles={["Profesor"]}
              />
            }
          >
            <Route
              path="/professorDashboard"
              element={<ProfessorDashboard />}
            />
            {/* Otras rutas solo para profesores */}
            <Route path="/mysubjects" element={<ProfessorSubjects />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/migrades" element={<MiGrade />} />
          </Route>

          <Route
            path="*"
            element={
              isAuthenticated ? (
                roleName === "Administrador" ? (
                  <Navigate to="/adminDashboard" replace />
                ) : roleName === "Profesor" ? (
                  <Navigate to="/professorDashboard" replace />
                ) : (
                  <Navigate to="/unauthorized" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
