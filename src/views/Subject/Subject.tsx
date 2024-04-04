import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './subject.css';

const CombinedForm = () => {
  const [año, setAño] = useState('');
  const [seccion, setSeccion] = useState('');
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica para enviar los datos a tu backend
    console.log('Año:', año);
    console.log('Sección:', seccion);
    console.log('Nombre:', nombre);
    console.log('Código:', codigo);
    // Reinicia los campos del formulario después de enviar los datos
    setAño('');
    setSeccion('');
    setNombre('');
    setCodigo('');
  };

  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-lg-5 d-none d-lg-block bg-book-image"></div>
            <div className="col-lg-7">
              <div className="form-body">
                <div className="row">
                  <div className="form-holder">
                    <div className="form-content">
                      <div className="form-items">
                        <h3>Registro de Materias</h3>
                        <p className="form-instruction">Completa los siguientes campos.</p>
                        <Form className="requires-validation" noValidate onSubmit={handleSubmit}>
                         
                          <div className="col-md-12">
                            <Form.Group controlId="formNombre">
                              <Form.Label>Nombre</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                              />
                            </Form.Group>
                          </div>

                          <div className="col-md-12">
                            <Form.Group controlId="formCodigo">
                              <Form.Label>Código</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Código"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                required
                              />
                            </Form.Group>
                          </div>
 <div className="col-md-12">
                  <Form.Group controlId="formPosition">
                    <Form.Label>
                       Grado 
                    </Form.Label>
                    <Form.Select
                      className="mt-3"
                      value={seccion}
                      onChange={(e) => setSeccion(e.target.value)}
                      required
                    >
                      <option selected disabled value="">Encargado</option>
                      <option value="jweb">Junior Web Developer</option>
                      <option value="sweb">Senior Web Developer</option>
                      <option value="pmanager">Project Manager</option>
                    </Form.Select>
                    <Form.Control.Feedback type="valid">You selected a position!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">Please select a position!</Form.Control.Feedback>
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

export default CombinedForm;
