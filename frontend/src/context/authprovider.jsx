import { createContext, useState, useContext } from 'react';

const AuthContext = createContext({
    user: null,
    role: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (userData, userRole) => {
        setUser(userData);
        setRole(userRole);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', userRole);
    };

    const logout = () => {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('role');
    };

    return (
        <AuthContext.Provider value={{
            user,
            role,
            isAuthenticated,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
