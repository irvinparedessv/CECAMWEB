import React, { useEffect, useState } from 'react';
import './rols.css';
import RolService from '../../services/RolService';
import { Rol } from '../../types';

const Rols = () => {
  const [rols, setRols] = useState<Rol[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [editingRole, setEditingRole] = useState<Rol | null>(null);
  const [updatedRoleName, setUpdatedRoleName] = useState('');

  useEffect(() => {
    fetchRols();
  }, []);

  const fetchRols = async () => {
    try {
      const rolList = await RolService.getAllRols();
      setRols(rolList);
    } catch (error) {
      console.error('Error al obtener roles:', error);
    }
  };

  const handleInsertRole = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await RolService.insertRol(newRoleName);
      console.log('¡Rol insertado correctamente!');
      await fetchRols();
      setNewRoleName('');
    } catch (error) {
      console.error('Error al insertar rol:', error);
    }
  };

  const handleEditRole = (rol: Rol) => {
    setEditingRole(rol);
    setUpdatedRoleName(rol.roleName); // Establece el nombre del rol seleccionado en el campo de texto
  };
  
  
  const handleUpdateRole = async () => {
    if (!editingRole) return;
  
    try {
      await RolService.updateRol(editingRole.rolId, updatedRoleName);
      await fetchRols();
      setEditingRole(null);
      // No necesitas restablecer updatedRoleName aquí
    } catch (error) {
      console.error('Error al actualizar rol:', error);
    }
  };
  

  const handleDeleteRole = async (rolId: number) => {
    try {
      await RolService.deleteRol(rolId);
      await fetchRols();
    } catch (error) {
      console.error('Error al eliminar rol:', error);
    }
  };

  return (
    <div className="content">
      <div className="container">
        <h1>Roles</h1>
        <form onSubmit={handleInsertRole}>
          <input
            type="text"
            placeholder="Nombre del rol"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            required
          />
          <button type="submit">Agregar Rol</button>
        </form>

        <table className="roles-table">
          <thead>
            <tr>
              <th>Nombre del Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rols.map((rol, index) => (
              <tr key={index}>
                <td>{rol.roleName}</td>
                <td>
                  {editingRole && editingRole.rolId === rol.rolId ? (
                    <div>
                      <input
                        type="text"
                        value={updatedRoleName}
                        onChange={(e) => setUpdatedRoleName(e.target.value)}
                      />
                      <button onClick={handleUpdateRole}>Guardar</button>
                    </div>
                  ) : (
                    <div>
                      <button className="eliminar-btn" onClick={() => handleDeleteRole(rol.rolId)}>Eliminar</button>
                      <button className="actualizar-btn" onClick={() => handleEditRole(rol)}>Editar</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rols;
