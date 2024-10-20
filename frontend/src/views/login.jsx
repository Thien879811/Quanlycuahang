import { useRef , useEffect} from "react";
import { Link } from "react-router-dom"
import {useStateContext} from '../context/contextprovider'
import authService from "../services/auth.service";
import { handleToken } from "../functions";

export default function login(){
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const {setUser, setToken} = useStateContext();

    const  Submit = async(ev) => {
        ev.preventDefault();
        const user = {
            email: emailRef.current.value,
            password: passwordRef.current.value, 
        }
            try{
                const response = await  authService.login(user);
                const cleanJsonString = response.replace(/^[^[{]*([\[{])/,'$1').replace(/([\]}])[^}\]]*$/,'$1');
                const data = JSON.parse(cleanJsonString);
                const token = handleToken(data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('ACCESS_TOKEN', token);
                setUser(data.user);
                setToken(token);
            }catch(err){
                console.log(err)
            }
    
        
    }
    return (
        <div className="login-signup-form animated fadeinDown">
            <div className="form">
                <h1 className="title">
                    Login To Your Account
                </h1>
                <form onSubmit={Submit}>
                    <input ref={emailRef} type="text" placeholder="Email" />
                    <input ref={passwordRef} type="password" placeholder="Password" />
                    <button className="btn btn-block">Login</button>
                </form>
            </div>
        </div>
    )
}
