import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faClipboardList, faChalkboard, faStickyNote, faCommentAlt, faUser } from '@fortawesome/free-solid-svg-icons';

import './navbar.scss';

interface NavbarProps {
  logout: () => void; // Definimos el tipo de la función logout como una función que no toma argumentos y no devuelve nada
}

const Navbar: React.FC<NavbarProps> = ({ logout }) => {
  return (
    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
        <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <span className="fs-5 d-none d-sm-inline">Menu</span>
        </a>
        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
          <li>
            <Link to={"/students"} className="nav-link px-0 align-middle" >
              <FontAwesomeIcon icon={faChalkboard} className="me-2" />
              Estudiantes
            </Link>
          </li>
          <li>
            <Link to={"/parents"} className="nav-link px-0 align-middle" >
              <FontAwesomeIcon icon={faChalkboard} className="me-2" />
              Padres
            </Link>
          </li>
          <li>
            <Link to={"/parentAssociations"} className="nav-link px-0 align-middle" >
              <FontAwesomeIcon icon={faChalkboard} className="me-2" />
              Asociacion de padres
            </Link>
          </li>
          <li>
            <Link to={"/attendances"} className="nav-link px-0 align-middle" >
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Asistencias
            </Link>
          </li>
          <li>
            <Link to={"/migrades"} className="nav-link px-0 align-middle" >
              <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
              Mis Grados
            </Link>
          </li>
          <li>
            <Link to={"/notes"} className="nav-link px-0 align-middle" >
              <FontAwesomeIcon icon={faStickyNote} className="me-2" />
              Notas
            </Link>
          </li>
          <li>
            <Link to={"/rols"} className="nav-link px-0 align-middle" >
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Roles
            </Link>
          </li>
          <li>
            <Link to={"/observations"} className="nav-link px-0 align-middle" >
              <FontAwesomeIcon icon={faCommentAlt} className="me-2" />
              Observaciones
            </Link>
          </li>
        </ul>
        <div className="dropdown pb-4">
          <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            <span className="d-none d-sm-inline mx-1">TeacherName</span>
          </a>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
            <li><a className="dropdown-item" href="#">New project...</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li>
            </li>
            <li><a className="dropdown-item" href="#" onClick={logout}>Sign out</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
