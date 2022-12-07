import "../../styles/Login.css"

import { Button, Input } from '@chakra-ui/react'
import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"

export default function Login(props){

    const [login, setLogin] = useState({email: "", password: ""});
    const navigate = useNavigate();

    const handleLoginSubmit = () => {
      fetch(`http://localhost:8080/api/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: login.email,
          password: login.password
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        props.cookies.set('Bearer', data.token);
        setLogin({email: "", password: ""});
        
      })
      .then(() => {props.onRegister(); navigate('/');})
      .catch((e) => {
        console.log("Something went wrong ", e);
      })
    }

    const handleLoginChange = (event) => {
      setLogin((prevState) => {
        return {
        ...prevState,
        [event.target.name]: event.target.value,
      }
      })
    }

    return(
        <>
            <div className="login-wrapper">
                <div className="login-container">
                    <div className="left-column">
                        <p className="title">Sign In</p>
                        <Input value={login.email} onChange={handleLoginChange} name='email' backgroundColor={"#ECF3F6"} placeholder='User Email' />
                        <Input value={login.password} onChange={handleLoginChange} name='password' backgroundColor={"#ECF3F6"} type="password" placeholder='Password' />
                        <p className="forgot">Forgot Your Password?</p>
                        <Button onClick={handleLoginSubmit} width="100px" colorScheme={"blue"} margin="0 auto" backgroundColor="#40ACFF" borderRadius={"24px"}>Sign In</Button>
                    </div>
                    <div className="right-column">
                        <p className="title">Sign Up</p>
                        <p className="info">Sign up if you don't have an account</p>
                        <Button width="100px" variant={"outline"} colorScheme={"white"} margin="0 auto" borderRadius={"24px"} _hover={{backgroundColor: "#40ACFF"}}>Sign Up</Button>
                    </div>
                </div>
            </div>
        </>
    )
}