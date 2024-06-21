import React, { useEffect, useState } from "react";
import "./migrade.css";
import { MiGradeData } from "../../types";
import { GradeService } from "../../services";
import { useNavigate } from "react-router-dom";

const MiGrade = () => {
  const [grades, setGrades] = useState<MiGradeData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const userInfoString = localStorage.getItem("userInfo");
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          const data = await GradeService.getMyGrades(userInfo.id); // Pasar el ID del profesor
          setGrades(data.data);
        } else {
          console.error("User info not found in localStorage.");
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    };
    fetchGrades();
  }, []);

  const handleNavigation = (id: string, path: string) => {
    navigate(`/${path}/grade/${id}/`);
  };

  return (
    <div className="container">
      <h1 className="titleh">MIS GRADOS</h1>
      <div className="row">
        {grades.map((grade) => (
          <div key={grade.id} className="col-xl-12 col-lg-12">
            <div className={`sv_card l-bg-${grade.grade.gradeId}-dark`}>
              <div className="card-statistic-3 p-4">
                <div className="card-icon card-icon-large">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="mb-4">
                  <h3 className="card-title mb-0">{grade.grade.description}</h3>
                </div>
                <div className="row align-items-center mb-2 d-flex">
                  <div className="col-8">
                    <h4 className="d-flex align-items-center mb-0">
                      Estudiantes {grade.students}
                    </h4>
                  </div>
                </div>
                <div className="row c_ContainerButtons">
                  <button
                    className="btn btn-primary c_ButtonsCard"
                    onClick={() =>
                      handleNavigation(grade.id.toString(), "students")
                    }
                  >
                    Estudiantes
                  </button>
                </div>
                <div className="row c_ContainerButtons">
                  <button
                    className="btn btn-secondary c_ButtonsCard"
                    onClick={() =>
                      handleNavigation(grade.id.toString(), "attendance")
                    }
                  >
                    Asistencia
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiGrade;
