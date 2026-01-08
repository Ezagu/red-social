import React, { useState, useEffect, createContext } from 'react';
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

  const [auth, setAuth] = useState({});
  const [counters, setCounters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authUser();
  }, []);

  const authUser = async () => {
    // Sacar datos del usuario identificado del localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // Comprobar si tengo el token y el user
    if(!token || !user) {
      setLoading(false);
      return false;
    }

    // Transfomar los datos a un obj de js
    const userObj = JSON.parse(user);
    const userId = userObj._id;

    // Peticion ajax al backend que compruebe el token y que devuelva los datos del usuario
    const request = await fetch(Global.url + 'user/profile/' + userId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });

    const data = await request.json();

    // Peticion para los contadores
    const requestCounters = await fetch(Global.url + 'user/counters/' + userId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });

    const dataCounters = await requestCounters.json();

    // Setear el estado del auth
    setAuth(data.user);
    setCounters(dataCounters);

    setLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        setCounters,
        counters,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;