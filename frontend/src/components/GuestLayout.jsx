import { useStateContext } from "../context/contextprovider";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestLayout(){
    const {token} = useStateContext();
    if(token){
       return <Navigate to='/home'/>
    }

    return(
        <div>
            <div>
            </div>
            <Outlet />
        </div>
    )
}