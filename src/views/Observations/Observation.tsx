import React from 'react';
import './observation.css';

const Observation = () => {
    return (
        
<div className="event-schedule-area-two bg-color pad100">
    <div className="container">
        <div className="row">
            <div className="col-lg-12">
                <div className="section-title text-center">
                    <div className="title-text">
                        <h2>Observaciones Estudiantes</h2>
                    </div>
                
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-lg-12">
               
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade active show" id="home" role="tabpanel">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text-center" scope="col">Fecha</th>
                                        <th scope="col">Profesor</th>
                                        <th scope="col">Comentario</th>
                                        <th scope="col">Materia</th>
                                      
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="inner-box">
                                        <th scope="row">
                                            <div className="event-date">
                                                <span>5</span>
                                                <p>Septiembre</p>
                                            </div>
                                        </th>
                                        <td>
                                            <div className="event-img">
                                                <img className='event-image' src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="event-wrap">
                                               NO ENTREGO TAREA
                                            </div>
                                        </td>
                                        <td>
                                            <div className="r-no">
                                                <span>MATEMATICAS</span>
                                            </div>
                                        </td>
                                      
                                    </tr>
                                    <tr className="inner-box">
                                        <th scope="row">
                                            <div className="event-date">
                                                <span>10</span>
                                                <p>Octubre</p>
                                            </div>
                                        </th>
                                        <td>
                                            <div className="event-img">
                                                <img className='event-image' src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="event-wrap">
                                              INASISTENCIA
                                            </div>
                                        </td>
                                        <td>
                                            <div className="r-no">
                                                <span>GENERAL</span>
                                            </div>
                                        </td>
                                       
                                    </tr>
                                    <tr className="inner-box border-bottom-0">
                                        <th scope="row">
                                            <div className="event-date">
                                                <span>18</span>
                                                <p>Noviembre</p>
                                            </div>
                                        </th>
                                        <td>
                                            <div className="event-img">
                                                <img className='event-image' src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="event-wrap">
                                                EXAMEN REPROBADO 
                                            </div>
                                        </td>
                                        <td>
                                            <div className="r-no">
                                                <span>SOCIALES</span>
                                            </div>
                                        </td>
                                        
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                </div>
              
            </div>
        </div>
    </div>
                    <div className="primary-btn text-center">
                    <a href="#" className="btn btn-primary">Agregar nueva</a>
                </div>

</div>
    );
};

export default Observation;