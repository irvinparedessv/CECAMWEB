/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import './reportgrade.css'; // Importar archivo de estilos CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
interface Nota {
  materia: string;
  nota: number;
}

interface BoletaProps {
  estudiante: string;
  notas: Nota[];
  grado: string;
}

const ReportGrades: React.FC<BoletaProps> = ({ estudiante, notas, grado }) => {
    function handleEditarNota(index: number): void {
        throw new Error('Function not implemented.');
    }

    function handleAgregarNota(index: number): void {
        throw new Error('Function not implemented.');
    }

  return (
    <div className="boleta">
      <h2>Notas {estudiante} {grado}</h2>
      <table className="tabla-notas">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Nota</th>
            <th>Acciones</th> {/* Agregamos una nueva columna para las acciones */}
          </tr>
        </thead>
        <tbody>
          {notas.map((nota, index) => (
            <tr key={index}>
              <td>{nota.materia}</td>
              <td>{nota.nota}</td>
              {index % 4 === 0 && 
              <td>
                <button className='btn-grade' onClick={() => handleAgregarNota(index)}>
                  <FontAwesomeIcon icon={faPlus} /> {/* Icono para Agregar */}
                </button>
                <button className='btn-grade' onClick={() => handleEditarNota(index)}>
                  <FontAwesomeIcon icon={faEdit} /> {/* Icono para Editar */}
                </button>
                <button className='btn-grade' onClick={() => handleEditarNota(index)}>
                  <FontAwesomeIcon icon={faTrash} /> {/* Icono para Eliminar */}
                </button>
              </td>
}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportGrades;
