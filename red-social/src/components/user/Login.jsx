import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm.jsx';
import { Global } from '../../helpers/Global.jsx';

export const Login = () => {

  const { form, changed } = useForm({});
  const [ logued, setLogued ] = useState({});
  

  const loginUser = async (e) => {
    e.preventDefault();

    // Datos del form
    const userToLogin = form;

    // Petición al backend
    const req = await fetch(Global.url + 'user/login', {
      method: 'POST',
      body: JSON.stringify(userToLogin),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await req.json();

    setLogued({status: data.status, message: data.message});

    // Persistir los datos en el navegador
    if(data.status = 'success') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  }

  return (
    <>
      <header className="content__header">
          <h1 className="content__title">Login</h1>
      </header>

      <div className="content__posts">

        {
          logued.status === 'success' 
          ? (<strong className="alert alert-success">
              {logued.message}
            </strong>)
          : ''
        }

        {
          logued.status === 'error' 
          ? (<strong className="alert alert-danger">
              {logued.message}
            </strong>)
          : ''
        }

        <form className='form-login' onSubmit={loginUser}>

          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' name='email' onChange={changed}/>
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Contraseña</label>
            <input type='password' name='password' onChange={changed}/>
          </div>

          <input type='submit' value='Identificate' className='btn btn-success'></input>

        </form>
      </div>
    </>
  )
}
