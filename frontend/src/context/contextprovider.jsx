import { useContext, useState, createContext, useEffect } from "react";
import axios from "axios";
import AuthService from "../services/auth.service";

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {}
});

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

    const setToken = (token) => {
        _setToken(token)
        if(token){
            localStorage.setItem('ACCESS_TOKEN',token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log(localStorage.getItem('user'));
        }
        else{
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('user');
        }
    }

    return (
        <StateContext.Provider value={{
            user,
            token,
            setUser,
            setToken
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)