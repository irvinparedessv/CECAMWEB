// import React, { useEffect, useState } from "react";
// import "./migrade.css";
// import { MiGradeData } from "../../types";
// import { GradeService } from "../../services";
// import { useNavigate } from "react-router-dom";

// const MiGrade = () => {
//   const [grades, setGrades] = useState<MiGradeData[]>([]);
//   const navigate = useNavigate(); // Obtiene la función de navegación

//   useEffect(() => {
//     const fetchGrades = async () => {
//       try {
//         const data = await GradeService.getMyGrades();
//         setGrades(data.data);
//       } catch (error) {
//         console.error("Error fetching grades:", error);
//       }
//     };
//     fetchGrades();
//   }, []);

//   const handleGradeClick = (id: string) => {
//     // Navega al usuario a la ruta correspondiente cuando hagan clic en el grado
//     navigate(`/students/grade/${id}`);
//   };
//   return (
//     <div className="container">
//       <h1 className="titleh">MIS GRADOS</h1>
//       <div className="row">
//         {grades.map((grade) => (
//           <div
//             key={grade.id}
//             className="col-xl-12 col-lg-12"
//             onClick={() => handleGradeClick(grade.id.toString())}
//           >
//             <div className={`sv_card l-bg-${grade.grade.gradeId}-dark`}>
//               <div className="card-statistic-3 p-4">
//                 <div className="card-icon card-icon-large">
//                   <i className="fas fa-shopping-cart"></i>
//                 </div>
//                 <div className="mb-4">
//                   <h5 className="card-title mb-0">{grade.grade.description}</h5>
//                 </div>
//                 <div className="row align-items-center mb-2 d-flex">
//                   <div className="col-8">
//                     <h2 className="d-flex align-items-center mb-0">
//                       Estudiantes {grade.students}
//                     </h2>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MiGrade;





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
        const userInfoString = localStorage.getItem('userInfo');
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

  const handleGradeClick = (id: string) => {
    navigate(`/students/grade/${id}`);
  };

  return (
    <div className="container">
      <h1 className="titleh">MIS GRADOS</h1>
      <div className="row">
        {grades.map((grade) => (
          <div
            key={grade.id}
            className="col-xl-12 col-lg-12"
            onClick={() => handleGradeClick(grade.id.toString())}
          >
            <div className={`sv_card l-bg-${grade.grade.gradeId}-dark`}>
              <div className="card-statistic-3 p-4">
                <div className="card-icon card-icon-large">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="mb-4">
                  <h5 className="card-title mb-0">{grade.grade.description}</h5>
                </div>
                <div className="row align-items-center mb-2 d-flex">
                  <div className="col-8">
                    <h2 className="d-flex align-items-center mb-0">
                      Estudiantes {grade.students}
                    </h2>
                  </div>
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
