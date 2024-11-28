import { useContext, useState, createContext, useEffect } from "react";
import authService from "../services/auth.service";
import { handleResponse } from "../functions";
import { Navigate } from 'react-router-dom';

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
    userRole: null
});

export const ContextProvider = ({children}) => {
    const [user, _setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

    useEffect(() => {
        const verifyToken = async () => {
            try {
                if (token) {
                    const response = await authService.getCurrentUser(token);
                    const data = handleResponse(response);
                    if (data) {
                        setUser(data.user);
                    } else {
                        setToken(null);
                        setUser(null);
                    }
                }
            } catch (error) {
                setToken(null);
                setUser(null);
            }
        };
        verifyToken();
    }, [token]);

    const setUser = (user) => {
        _setUser(user);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }

    const setToken = (token) => {
        _setToken(token)
        if(token){
            localStorage.setItem('ACCESS_TOKEN',token);
        }
        else{
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('user');
            setUser(null);
        }
    }

    const userRole = user ? user.role : null;

    return (
        <StateContext.Provider value={{
            user,
            token,
            setUser,
            setToken,
            userRole,
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)