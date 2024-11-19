import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useStateContext } from '../context/contextprovider';
import authService from '../services/auth.service';
import { handleResponse } from '../functions';

const PrivateRoute = ({ children, role }) => {
    const { user, setUser } = useStateContext();
    const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await authService.getCurrentUser(token);
                const data = handleResponse(response);
                setUser(data);
            } catch (error) {
                console.error('Error fetching user:', error);
                localStorage.removeItem('ACCESS_TOKEN');
                setToken(null);
            } finally {
                setIsLoading(false);
            }
        }

        if (token) {
            getCurrentUser();
        } else {
            setIsLoading(false);
        }
    }, [token, setUser]);

    if (isLoading) {
        return <div>Loading...</div>; // Hoặc component loading của bạn
    }

    if (!token) {
        return <Navigate to="/login" />;
    }

    // Kiểm tra role
    if (!user || user.role !== 'admin') {
        // Redirect về trang phù hợp với role của user
        switch (user?.role) {
            case 'admin':
                return <Navigate to="/admin" />;
            case 'employee':
                return <Navigate to="/" />;
            default:
                return <Navigate to="/" />;
        }
    }
};

export default PrivateRoute;
