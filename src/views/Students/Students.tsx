import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './student.css';
import {User} from '../../types';
import UserService from '../../services/UserService';


const Students = () => {
   const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    // Utiliza el servicio para obtener todos los usuarios cuando el componente se monta
    const fetchData = async () => {
      try {
        const userList = await UserService.getAllUsers();
        setStudents(userList);
      } catch (error) {
        // Manejar el error según sea necesario
      }
    };

    fetchData(); // Llama a la función fetchData para obtener los usuarios
  }, []); // 

    return (
        <div className="content">
            <div className="container">
               <h1>sss</h1>

                <div className="row">
                    {students.map((student, index) => (
                        <div key={index} className="col-lg-4">
                            <div className="text-center card-box">
                                <div className="member-card pt-2 pb-2">
                                    <div className="thumb-lg member-thumb mx-auto">
                                        <img src={student.imageUrl} className="rounded-circle img-thumbnail" alt="profile-image" />
                                    </div>
                                    <div className="">
                                        <h4>{student.name}</h4>
                                        <p className="text-muted">{student.role} <span>| </span>
                                            <span><a href="#" className="text-pink">{student.website}</a></span>
                                        </p>
                                    </div>
                                  {/*   <ul className="social-links list-inline">
                                        {student.socialLinks.map((link, index) => (
                                            <li key={index} className="list-inline-item">
                                                <a title="" data-placement="top" data-toggle="tooltip" className="tooltips" href={link.url} data-original-title={link.icon}><i className={link.icon}></i></a>
                                            </li>
                                        ))}
                                    </ul> */}
                                    <button type="button" className="btn btn-primary mt-1 btn-rounded waves-effect w-md waves-light btnMessage">Observaciones</button>
                                    
                                    <button type="button" className="btn btn-primary mt-1 btn-rounded waves-effect w-md waves-light btnMessage">Notas</button>
                                    <div className="mt-4">
                                        <div className="row">
                                            {student.metrics.map((metric, index) => (
                                                <div key={index} className="col-4">
                                                    <div className="mt-1">
                                                        <h4>{metric.value}</h4>
                                                        <p className="mb-0 text-muted">{metric.label}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination section */}
                <div className="row">
                    <div className="col-12">
                        <div className="text-right">
                            <ul className="pagination pagination-split mt-0 float-right">
                                <li className="page-item"><a className="page-link" href="#" aria-label="Previous"><span aria-hidden="true">«</span> <span className="sr-only">Previous</span></a></li>
                                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item"><a className="page-link" href="#">4</a></li>
                                <li className="page-item"><a className="page-link" href="#">5</a></li>
                                <li className="page-item"><a className="page-link" href="#" aria-label="Next"><span aria-hidden="true">»</span> <span className="sr-only">Next</span></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Students;
