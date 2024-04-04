import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './register.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [agreement, setAgreement] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica para enviar los datos a tu backend
    console.log('Nombre:', nombre);
    console.log('Email:', email);
    console.log('Position:', position);
    console.log('Password:', password);
    console.log('Gender:', gender);
    console.log('Agreement:', agreement);
    // Reinicia los campos del formulario después de enviar los datos
    setNombre('');
    setEmail('');
    setPosition('');
    setPassword('');
    setGender('');
    setAgreement(false);
  };

  return (
<div className='col-sm-12'>

     <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body">
                <div className="row">
                    <div className="col-lg-2 d-none d-lg-block bg-register-image"></div>
                    <div className="col-lg-9">
    <div className="form-body">
      <div className="row">
        <div className="form-holder">
          <div className="form-content">
            <div className="form-items">
              <h3>Datos Estudiantes</h3>
              <p className="form-instruction">Completa los siguientes campos.</p>
              <Form className="requires-validation" noValidate onSubmit={handleSubmit}>
                <div className="col-md-12">
                  <Form.Group controlId="formNombre">
                    <Form.Label>
                        Nombres
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nombres"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="valid">Username field is valid!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">Username field cannot be blank!</Form.Control.Feedback>
                  </Form.Group>
                </div>
 <div className="col-md-12">
                  <Form.Group controlId="formApellido">
                    <Form.Label>
                        Apellidos
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Apellidos"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="valid">Username field is valid!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">Username field cannot be blank!</Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-12">
                  <Form.Group controlId="formEmail">
                       <Form.Label>
                        Correo
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Correo"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="valid">Email field is valid!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">Email field cannot be blank!</Form.Control.Feedback>
                  </Form.Group>
                </div>
      <div className="col-md-12">
                  <Form.Group controlId="formPassword">
                      <Form.Label>
                        Contraseña
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="valid">Password field is valid!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">Password field cannot be blank!</Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-12">
                  <Form.Group controlId="formPosition">
                      <Form.Label>
                        Grado y Seccion
                    </Form.Label>
                    <Form.Select
                      className="mt-3"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                    >
                      <option selected disabled value="">Grado</option>
                      <option value="jweb">Junior Web Developer</option>
                      <option value="sweb">Senior Web Developer</option>
                      <option value="pmanager">Project Manager</option>
                    </Form.Select>
                    <Form.Control.Feedback type="valid">You selected a position!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">Please select a position!</Form.Control.Feedback>
                  </Form.Group>
                </div>

          

                <div className="col-md-12 mt-3">
                  <label className="mb-3 mr-1" htmlFor="gender">Genero: </label>

                  <div>
                    <Form.Check
                      inline
                      label="Masculino"
                      type="radio"
                      id="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      required
                    />
                    <Form.Check
                      inline
                      label="Femenino"
                      type="radio"
                      id="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      required
                    />
                    <Form.Check
                      inline
                      label="Otro"
                      type="radio"
                      id="secret"
                      checked={gender === 'secret'}
                      onChange={() => setGender('secret')}
                      required
                    />
                  </div>
                  <Form.Control.Feedback type="valid" className="mv-up">You selected a gender!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid" className="mv-up">Please select a gender!</Form.Control.Feedback>
                </div>

            

                <div className="form-button mt-3">
                  <Button className='button-register' id="submit" type="submit" variant="primary">Registrar</Button>
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

export default Register;
