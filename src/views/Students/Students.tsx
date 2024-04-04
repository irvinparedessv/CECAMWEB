import React, { useState } from 'react';
import './student.css';

const Students = () => {
    const [students, setStudents] = useState([
        {
            name: "Freddie J. Plourde",
            role: "8-A",
            website: "freddie@cecam.com",
            imageUrl: "https://bootdey.com/img/Content/avatar/avatar2.png",
            socialLinks: [
                { icon: "fa fa-facebook", url: "#" },
                { icon: "fa fa-twitter", url: "#" },
                { icon: "fa fa-skype", url: "#" }
            ],
            metrics: [
                { label: "Matematicas", value: 9 },
                { label: "Ingles", value: 8 },
                { label: "Lenguaje", value: 8 },
                { label: "Sociales", value: 8 },
                { label: "Total Inasistencias", value: 1 }
            ]
        },
           {
            name: "Jose J. Palle",
            role: "8-A",
            website: "jose@cecam.com",
            imageUrl: "https://bootdey.com/img/Content/avatar/avatar1.png",
            socialLinks: [
                { icon: "fa fa-facebook", url: "#" },
                { icon: "fa fa-twitter", url: "#" },
                { icon: "fa fa-skype", url: "#" }
            ],
            metrics: [
                { label: "Matematicas", value: 10 },
                { label: "Ingles", value: 7 },
                { label: "Lenguaje", value: 6 },
                { label: "Sociales", value: 8 },
                { label: "Total Inasistencias", value: 1 }
            ]
        },
        {
        name: "María L. Gómez",
        role: "8-B",
        website: "maria@cecam.com",
        imageUrl: "https://bootdey.com/img/Content/avatar/avatar3.png",
        socialLinks: [
            { icon: "fa fa-facebook", url: "#" },
            { icon: "fa fa-twitter", url: "#" },
            { icon: "fa fa-linkedin", url: "#" }
        ],
        metrics: [
            { label: "Matematicas", value: 9 },
            { label: "Ingles", value: 8 },
            { label: "Lenguaje", value: 7 },
            { label: "Sociales", value: 9 },
            { label: "Total Inasistencias", value: 0 }
        ]
    },
    {
        name: "Carlos M. Rodríguez",
        role: "8-C",
        website: "carlos@cecam.com",
        imageUrl: "https://bootdey.com/img/Content/avatar/avatar4.png",
        socialLinks: [
            { icon: "fa fa-facebook", url: "#" },
            { icon: "fa fa-instagram", url: "#" },
            { icon: "fa fa-linkedin", url: "#" }
        ],
        metrics: [
            { label: "Matematicas", value: 8 },
            { label: "Ingles", value: 6 },
            { label: "Lenguaje", value: 7 },
            { label: "Sociales", value: 8 },
            { label: "Total Inasistencias", value: 2 }
        ]
    },
    {
        name: "Ana R. López",
        role: "8-D",
        website: "ana@cecam.com",
        imageUrl: "https://bootdey.com/img/Content/avatar/avatar8.png",
        socialLinks: [
            { icon: "fa fa-twitter", url: "#" },
            { icon: "fa fa-linkedin", url: "#" },
            { icon: "fa fa-github", url: "#" }
        ],
        metrics: [
            { label: "Matematicas", value: 7 },
            { label: "Ingles", value: 9 },
            { label: "Lenguaje", value: 8 },
            { label: "Sociales", value: 7 },
            { label: "Total Inasistencias", value: 1 }
        ]
    }
     
    ]);

    return (
        <div className="content">
            <div className="container">
               

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
