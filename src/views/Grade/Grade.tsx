import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./grade.css";

const CombinedForm = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [agreement, setAgreement] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Reinicia los campos del formulario después de enviar los datos
    setNombre("");
    setEmail("");
    setPosition("");
    setPassword("");
    setGender("");
    setAgreement(false);
  };

  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-lg-5 d-none d-lg-block bg-calificacion-image"></div>
            <div className="col-lg-7">
              <div className="form-body">
                <div className="row">
                  <div className="form-holder">
                    <div className="form-content">
                      <div className="form-items">
                        <h3>Registro Grados</h3>
                        <p className="form-instruction">
                          Completa los siguientes campos.
                        </p>
                        <Form
                          className="requires-validation"
                          noValidate
                          onSubmit={handleSubmit}
                        >
                          <div className="col-md-12">
                            <Form.Group controlId="formNombre">
                              <Form.Label>Año</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Año"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                              />
                              <Form.Control.Feedback type="valid">
                                Username field is valid!
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="invalid">
                                Username field cannot be blank!
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-md-12">
                            <Form.Group controlId="formEmail">
                              <Form.Label>Seccionessss</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Seccion"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                              <Form.Control.Feedback type="valid">
                                Email field is valid!
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="invalid">
                                Email field cannot be blank!
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-md-12">
                            <Form.Group controlId="formPosition">
                              <Form.Label>Encargado</Form.Label>
                              <Form.Select
                                className="mt-3"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                required
                              >
                                <option selected disabled value="">
                                  Encargado
                                </option>
                                <option value="jweb">
                                  Junior Web Developer
                                </option>
                                <option value="sweb">
                                  Senior Web Developer
                                </option>
                                <option value="pmanager">
                                  Project Manager
                                </option>
                              </Form.Select>
                              <Form.Control.Feedback type="valid">
                                You selected a position!
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="invalid">
                                Please select a position!
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="form-button mt-3">
                            <Button
                              className="button-register"
                              id="submit"
                              type="submit"
                              variant="primary"
                            >
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
