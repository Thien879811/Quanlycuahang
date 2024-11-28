import { Navigate } from 'react-router-dom';
import { useStateContext } from '../context/contextprovider';

export default function RoleRoute({ children, allowedRoles }) {
    const { userRole } = useStateContext();
    if (!userRole || !allowedRoles.includes(userRole)) {
        return <Navigate to="/" />;
    }


    return children;
}
