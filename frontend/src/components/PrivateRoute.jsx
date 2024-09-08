import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useStateContext } from '../context/contextprovider';

const PrivateRoute = ({ children, roles }) => {
  
    const { user } = useStateContext();
    const [token, setToken] = useState(localStorage.getItem('token'));
    console.log(localStorage.getItem('user'));

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
