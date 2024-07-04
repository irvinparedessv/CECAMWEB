// // CON ESTE CODIGO SE TRAE EL FIRSTNAME Y LASTNAME DESDE LA BASE, PERO A LA HORA DE INICIAR SESION ME SALE EL LOADING

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUserGraduate, faClipboardList, faChalkboard, faStickyNote, faCommentAlt, faUser } from '@fortawesome/free-solid-svg-icons';
// import AuthService from '../../services/AuthService';
// import './navbar.scss';
// import { UserInformation } from '../../types';

// interface NavbarProps {
//   logout: () => void;
// }

// const Navbar: React.FC<NavbarProps> = ({ logout }) => {
//   const [userInformation, setUserInformation] = useState<UserInformation | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const userInformation: UserInformation = await AuthService.getUserDetails();
//         console.log('User information:', userInformation);
//         setUserInformation(userInformation);
//       } catch (error) {
//         console.error('Error fetching user details:', error);
//         setError('Error al obtener los detalles del usuario');
//       }
//     };

//     fetchUserDetails();

//     return () => {
//       setUserInformation(null);
//       setError(null);
//     };
//   }, []);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!userInformation) {
//     return <div>Loading...</div>;
//   }

//   const { firstName, lastName, rolId } = userInformation;

//   console.log('First Name:', firstName);
//   console.log('Last Name:', lastName);

//   return (
//     <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
//       <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
//         <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
//           <span className="fs-5 d-none d-sm-inline">Menu</span>
//         </a>
//         <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
//           {/* Opciones del menú según el rol */}
//           {rolId === 3 ? (
//             <>
//               <li>
//                 <Link to="/students" className="nav-link px-0 align-middle">
//                   <FontAwesomeIcon icon={faChalkboard} className="me-2" />
//                   Estudiantes
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/parents" className="nav-link px-0 align-middle">
//                   <FontAwesomeIcon icon={faChalkboard} className="me-2" />
//                   Padres
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/parentAssociations" className="nav-link px-0 align-middle">
//                   <FontAwesomeIcon icon={faChalkboard} className="me-2" />
//                   Asociación de padres
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/migrades" className="nav-link px-0 align-middle">
//                   <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
//                   Mis Grados
//                 </Link>
//               </li>
//               {/* Agrega aquí más opciones específicas para el rol de Profesor si es necesario */}
//             </>
//           ) : (
//             <>
//               {/* <li>
//                 <Link to="/students" className="nav-link px-0 align-middle">
//                   <FontAwesomeIcon icon={faChalkboard} className="me-2" />
//                   Estudiantes
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/parents" className="nav-link px-0 align-middle">
//                   <FontAwesomeIcon icon={faChalkboard} className="me-2" />
//                   Padres
//                 </Link>
//               </li> */}
//               <li>
//                 <Link to="/parentAssociations" className="nav-link px-0 align-middle">
//                   <FontAwesomeIcon icon={faChalkboard} className="me-2" />
//                   Asociación de padres
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/attendances" className="nav-link px-0 align-middle">
//                   <FontAwesomeIcon icon={faClipboardList} className="me-2" />
//                   Asistencias
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/grades" className="nav-link px-0 align-middle">
//                   <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
//                   Grados
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/notes" className="nav-link px-0 align-middle">
//                   <FontAwesomeIcon icon={faStickyNote} className="me-2" />
//                   Notas
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/rols" className="nav-link px-0 align-middle">
//                   <FontAwesomeIcon icon={faUser} className="me-2" />
//                   Gestión de usuarios
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/observations" className="nav-link px-0 align-middle">
//                   <FontAwesomeIcon icon={faCommentAlt} className="me-2" />
//                   Observaciones
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/subjects" className="nav-link px-0 align-middle">
//                   <FontAwesomeIcon icon={faChalkboard} className="me-2" />
//                   Asignaturas
//                 </Link>
//               </li>
//               {/* Agrega aquí más opciones específicas para otros roles si es necesario */}
//             </>
//           )}
//         </ul>
//         <div className="dropdown pb-4">
//           <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
//             <span className="d-none d-sm-inline mx-1">{firstName} {lastName}</span>
//           </a>
//           <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
//             <li><a className="dropdown-item" href="#">New project...</a></li>
//             <li><a className="dropdown-item" href="#">Settings</a></li>
//             <li>
//               <Link to="/profiles" className="dropdown-item">Perfil</Link>
//             </li>
//             <li><hr className="dropdown-divider" /></li>
//             <li><a className="dropdown-item" href="#" onClick={logout}>Sign out</a></li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

// ESTE CODIGO OBTIENE LOS DATOS POR MEDIO DEL LOCALSTORAGE

import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGraduate,
  faClipboardList,
  faChalkboard,
  faStickyNote,
  faCommentAlt,
  faUser,
  faBookBookmark,
  faIgloo,
  faSchoolCircleCheck,
  faBookOpenReader,
  faUserGroup,
  faUsers,
  faHouseUser,
} from "@fortawesome/free-solid-svg-icons";

import "./navbar.scss";

interface NavbarProps {
  logout: () => void; // Definimos el tipo de la función logout como una función que no toma argumentos y no devuelve nada
}

const Navbar: React.FC<NavbarProps> = ({ logout }) => {
  // Obtener el nombre de usuario y el rol del localStorage
  const userInfoString = localStorage.getItem("userInfo");
  //console.log(userInfoString)

  // Verificar si la información existe en localStorage
  if (!userInfoString) {
    console.log("No se encontró información del usuario en localStorage");
    return null; // O puedes renderizar un mensaje o componente de error
  }

  // Convertir la cadena JSON de vuelta a un objeto
  const userInfo = JSON.parse(userInfoString);
  // Acceder al roleName del objeto userInfo

  // Extraer el nombre de usuario y el rol del objeto userInfo
  const { firstName, lastName, roleName } = userInfo;

  return (
    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
        <a
          href="/"
          className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <span className="fs-5 d-none d-sm-inline">Menu</span>
        </a>
        <ul
          className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
          id="menu"
        >
          {/* Opciones del menú según el rol */}
          {roleName === "Profesor" ? (
            <>
              <li>
                <Link
                  to="/parentAssociations"
                  className="nav-link px-0 align-middle"
                >
                  <FontAwesomeIcon icon={faUsers} className="me-2" />
                  Asociación de padres
                </Link>
              </li>
              <li>
                <Link to="/migrades" className="nav-link px-0 align-middle">
                  <FontAwesomeIcon icon={faHouseUser} className="me-2" />
                  Mis Grados
                </Link>
              </li>
              <li>
                <Link to="/mysubjects" className="nav-link px-0 align-middle">
                  <FontAwesomeIcon icon={faBookOpenReader} className="me-2" />
                  Mis Materias
                </Link>
              </li>
              {/* Agrega aquí más opciones específicas para el rol de Profesor si es necesario */}
            </>
          ) : (
            <>
              {/* <li>
                <Link to="/students" className="nav-link px-0 align-middle">
                  <FontAwesomeIcon icon={faChalkboard} className="me-2" />
                  Estudiantes
                </Link>
              </li>
              <li>
                <Link to="/parents" className="nav-link px-0 align-middle">
                  <FontAwesomeIcon icon={faChalkboard} className="me-2" />
                  Padres
                </Link>
              </li> */}
              <li>
                <li>
                  <Link to="/rols" className="nav-link px-0 align-middle">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Gestión de usuarios
                  </Link>
                </li>
                <li>
                  <Link to="/students" className="nav-link px-0 align-middle">
                    <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
                    Estudiantes
                  </Link>
                </li>
                <li>
                  <Link to="/parents" className="nav-link px-0 align-middle">
                    <FontAwesomeIcon icon={faUserGroup} className="me-2" />
                    Padres
                  </Link>
                </li>
                <Link
                  to="/parentAssociations"
                  className="nav-link px-0 align-middle"
                >
                  <FontAwesomeIcon icon={faChalkboard} className="me-2" />
                  Asociación de padres
                </Link>
              </li>
              <li>
                <Link to="/grades" className="nav-link px-0 align-middle">
                  <FontAwesomeIcon
                    icon={faSchoolCircleCheck}
                    className="me-2"
                  />
                  Grados
                </Link>
              </li>
              <li>
                <Link to="/plans" className="nav-link px-0 align-middle">
                  <FontAwesomeIcon icon={faBookBookmark} className="me-2" />
                  Gestion Plan Estudiantil
                </Link>
              </li>
              <li>
                <Link to="/subjects" className="nav-link px-0 align-middle">
                  <FontAwesomeIcon icon={faBookOpenReader} className="me-2" />
                  Asignaturas
                </Link>
              </li>
              <li>
                <Link
                  to="/subject-grade"
                  className="nav-link px-0 align-middle"
                >
                  <FontAwesomeIcon icon={faBookOpenReader} className="me-2" />
                  Asociacion Materia-Profesores-Grado
                </Link>
              </li>

              {/* Agrega aquí más opciones específicas para otros roles si es necesario */}
            </>
          )}
        </ul>
        <div className="dropdown pb-4">
          <a
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="d-none d-sm-inline mx-1">
              {firstName} {lastName}
            </span>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-dark text-small shadow"
            aria-labelledby="dropdownUser1"
          >
            <li>
              <a className="dropdown-item" href="#">
                New project...
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Settings
              </a>
            </li>
            <li>
              <Link to="/profiles" className="dropdown-item">
                Perfil
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="#" onClick={logout}>
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
