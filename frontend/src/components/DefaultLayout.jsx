import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/contextprovider";

export default function DefaultLayout(){
    const {user, token} = useStateContext();
    if(!token){
        return <Navigate to='/login'/>
    }

    return (
        <div id='defaultLayout'>
        <div className="content">
            <header>
                <div>
                    header
                </div>
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
    </div>
    );
}