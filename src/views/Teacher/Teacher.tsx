import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './teacher.css';

const TeacherForm = () => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
 const [gradosEncargados, setGradosEncargados] = useState<string[]>([]);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica para enviar los datos a tu backend
    console.log('Nombres:', nombres);
    console.log('Apellidos:', apellidos);
    console.log('Correo:', correo);
    console.log('Celular:', celular);
    console.log('Fecha de Nacimiento:', fechaNacimiento);
    console.log('Grados Encargados:', gradosEncargados);
    // Reinicia los campos del formulario después de enviar los datos
    setNombres('');
    setApellidos('');
    setCorreo('');
    setCelular('');
    setFechaNacimiento('');
    setGradosEncargados([]);
  };

  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-lg-5 d-none d-lg-block bg-teacher-image"></div>
            <div className="col-lg-7">
              <div className="form-body">
                <div className="row">
                  <div className="form-holder">
                    <div className="form-content">
                      <div className="form-items">
                        <h3>Registro de Profesores</h3>
                        <p className="form-instruction">Completa los siguientes campos.</p>
                        <Form className="requires-validation" noValidate onSubmit={handleSubmit}>
                          <div className="col-md-12">
                            <Form.Group controlId="formNombres">
                              <Form.Label>Nombres</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Nombres"
                                value={nombres}
                                onChange={(e) => setNombres(e.target.value)}
                                required
                              />
                            </Form.Group>
                          </div>

                          <div className="col-md-12">
                            <Form.Group controlId="formApellidos">
                              <Form.Label>Apellidos</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Apellidos"
                                value={apellidos}
                                onChange={(e) => setApellidos(e.target.value)}
                                required
                              />
                            </Form.Group>
                          </div>

                          <div className="col-md-12">
                            <Form.Group controlId="formCorreo">
                              <Form.Label>Correo</Form.Label>
                              <Form.Control
                                type="email"
                                placeholder="Correo"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                              />
                            </Form.Group>
                          </div>

                          <div className="col-md-12">
                            <Form.Group controlId="formCelular">
                              <Form.Label>Celular</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Celular"
                                value={celular}
                                onChange={(e) => setCelular(e.target.value)}
                                required
                              />
                            </Form.Group>
                          </div>

                          <div className="col-md-12">
                            <Form.Group controlId="formFechaNacimiento">
                              <Form.Label>Fecha de Nacimiento</Form.Label>
                              <Form.Control
                                type="date"
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                                required
                              />
                            </Form.Group>
                          </div>

                          <div className="col-md-12">
                            <Form.Group controlId="formGradosEncargados">
                              <Form.Label>Grados Encargados</Form.Label>
                              <Form.Select
                                className="mt-3"
                                multiple
                                value={gradosEncargados}
                                onChange={(e) => setGradosEncargados(Array.from(e.target.selectedOptions, (option) => option.value))}
                                required
                              >
                                <option value="7-A">7-A</option>
                                <option value="7-B">7-B</option>
                              </Form.Select>
                            </Form.Group>
                          </div>

                          <div className="form-button mt-3">
                            <Button className="button-register" id="submit" type="submit" variant="primary">
                              Guardar
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;
