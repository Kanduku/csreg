import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ element: Element, ...rest }) {
  const token = localStorage.getItem('token');
  return token ? <Element {...rest} /> : <Navigate to="/login" />;
}

export default PrivateRoute;
