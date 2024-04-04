import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Register } from './views/Register';
import { Grade } from './views/Grade';
import { Subject } from './views/Subject';
import { Students } from './views/Students';
import { Attendance } from './views/Attendance';
import { Teacher } from './views/Teacher';
import { Observation } from './views/Observations';
import { MiGrade } from './views/MiGrade';
import { ReportGrade } from './views/ReportGrade';
import { Login } from './views/Login';

const AuthGuard = ({ children }) => {
  const [isAuthenticated] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return children;
};


const App = () => {
  const notasEjemplo = [
    { materia: 'Matemáticas', nota: 9.0 },
    { materia: 'Ciencias', nota: 8.5 },
    { materia: 'Historia', nota: 8.0 },
    { materia: 'Lenguaje', nota: 7.0 },
    { materia: 'Educacion', nota: 8.0 },
    // Add more subjects and grades as needed
  ];

  const [isAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <div className="col py-3">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/" element={<AuthGuard />}>
            <Route path="/register-student" element={<Register />} />
            <Route path="/register-grades" element={<Grade />} />
            <Route path="/register-subjects" element={<Subject />} />
            <Route path="/register-teachers" element={<Teacher />} />
            <Route path="/subjects" element={<Subject />} />
            <Route path="/students" element={<Students />} />
            <Route path="/attendances" element={<Attendance />} />
            <Route
              path="/notes"
              element={<ReportGrade estudiante='Irvin Paredes' grado='7-A' key={'ds'} notas={notasEjemplo} />}
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
