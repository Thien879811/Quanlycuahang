import { useRef } from "react";
import { Link } from "react-router-dom"
import {useStateContext} from '../context/contextprovider'
import authService from "../services/auth.service";

export default function register(){

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const {setUser, setToken} = useStateContext();

    const  Submit = async (ev) => {
        ev.preventDefault();
        const user = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }
        try{
            const response = await  authService.register(user);
            const cleanJsonString = response.replace(/^<!--\s*|\s*-->$/g, '');
            const data = JSON.parse(cleanJsonString);
            setUser(data.user);
            setToken(data.token);

        }catch(err){
            console.log(err)
        }
    }
    return (
        <div className="login-signup-form animated fadeinDown">
            <div className="form">
                <h1 className="title">
                    Create A New Account
                </h1>
                <form onSubmit={Submit} >
                    <input ref={nameRef} type="text" placeholder="Name" />
                    <input ref={emailRef} type="text" placeholder="Email" />
                    <input ref={passwordRef} type="password" placeholder="Password" />
                    <button className="btn btn-block">Register</button>
                    <p className="message">
                        Already Have An Account? <Link to= '/login'>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
