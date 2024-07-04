import React from "react";

const NoAuthorized = () => {
  return (
    <div className="bg-dark text-white py-5 PAGENOAUTH">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-10">
            <h3>OPPSSS!!!!</h3>
            <p>
              Lo lamentamos no tiene permiso a esta pagina
              <br />
              <i className="fa fa-exclamation-triangle fa-5x"></i>
              Status Code: 403
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoAuthorized;
