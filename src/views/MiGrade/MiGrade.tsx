import React from "react";
import "./migrade.css";

const MiGrade = () => {
  return (
    <div className="container">
      <h1 className="titleh">MIS GRADOS</h1>
      <div className="row ">
        <div className="col-xl-6 col-lg-6">
          <div className="sv_card l-bg-cherry">
            <div className="card-statistic-3 p-4">
              <div className="card-icon card-icon-large">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="mb-4">
                <h5 className="card-title mb-0">Matematicas 7-A</h5>
              </div>
              <div className="row align-items-center mb-2 d-flex">
                <div className="col-8">
                  <h2 className="d-flex align-items-center mb-0">
                    Estudiantes 60
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6">
          <div className="sv_card l-bg-blue-dark">
            <div className="card-statistic-3 p-4">
              <div className="card-icon card-icon-large">
                <i className="fas fa-users"></i>
              </div>
              <div className="mb-4">
                <h5 className="card-title mb-0">Sociales 7-B</h5>
              </div>
              <div className="row align-items-center mb-2 d-flex">
                <div className="col-8">
                  <h2 className="d-flex align-items-center mb-0">
                    Estudiantes 23
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6">
          <div className="sv_card l-bg-green-dark">
            <div className="card-statistic-3 p-4">
              <div className="card-icon card-icon-large">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <div className="mb-4">
                <h5 className="card-title mb-0">Lenguaje 6-A</h5>
              </div>
              <div className="row align-items-center mb-2 d-flex">
                <div className="col-8">
                  <h2 className="d-flex align-items-center mb-0">
                    Estudiantes 42
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6">
          <div className="sv_card l-bg-orange-dark">
            <div className="card-statistic-3 p-4">
              <div className="card-icon card-icon-large">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="mb-4">
                <h5 className="card-title mb-0">Ciencias 8-A</h5>
              </div>
              <div className="row align-items-center mb-2 d-flex">
                <div className="col-8">
                  <h2 className="d-flex align-items-center mb-0">
                    Estudiantes 15
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiGrade;
