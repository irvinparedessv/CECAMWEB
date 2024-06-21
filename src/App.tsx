// import React from "react";
// import AppRoutes from "./router";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "react-confirm-alert/src/react-confirm-alert.css";

// import "./App.css";

// const App: React.FC = () => {
//   return (
//     <div className="container-fluid">
//       <div className="row flex-nowrap">
//         <AppRoutes />
//       </div>
//     </div>
//   );
// };

// export default App;

import React from "react";
import AppRoutes from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import "./App.css";
//import AuthProvider from "./components/AuthProvider"; // Importa tu AuthProvider

import { AuthProvider } from "./components/AuthProvider";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <AppRoutes />
        </div>
      </div>
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;
