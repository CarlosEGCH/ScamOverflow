import "../../styles/Login.css"

import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"

export default function Login(props){

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast()

    const [login, setLogin] = useState({email: "", password: ""});
    const [signup, setSignup] = useState({name: "", email: "", phone: "", password: "", rpassword: "", occupation: ""});
    const [banMessage, setBanMessage] = useState("");

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
      .then(async (data) => {
        if(data.ban){
          setBanMessage(data.ban);
          toast({
            title: "Your account has been banned",
            description: `Reason: ${data.ban}`,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          return;
        }
        props.cookies.set('Bearer', data.token);
        setLogin({email: "", password: ""});
        props.onRegister();
        navigate('/');
      })
      .catch((e) => {
        console.log("Something went wrong ", e);
      })
    }

    const handleSignupSubmit = () => {

      if(signup.password != signup.rpassword){
        console.log("Different Passwords");
        return;
      }

      fetch(`http://localhost:8080/api/signup`, {
        method: 'POST',
        body: JSON.stringify({
          name: signup.name,
          occupation: signup.occupation,
          phone: signup.phone,
          email: signup.email,
          password: signup.password
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        props.cookies.set('Bearer', data.token);
        setSignup({email: "", password: "", name: "", phone: ""});
        
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

    const handleSignupChange = (event) => {
      setSignup((prevState) => {
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
                        <Button onClick={onOpen} width="100px" variant={"outline"} colorScheme={"white"} margin="0 auto" borderRadius={"24px"} _hover={{backgroundColor: "#40ACFF"}}>Sign Up</Button>
                    </div>
                </div>
                <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Sign Up</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody display={"flex"} flexDirection={"column"} gap={"10px"}>
                    <Input value={signup.name} onChange={handleSignupChange} name="name" placeholder='Name...' />
                    <Input value={signup.occupation} onChange={handleSignupChange} name="occupation" placeholder='Occupation...' />
                    <Input value={signup.email} onChange={handleSignupChange} name="email" placeholder='Email...' />
                    <Input value={signup.phone} onChange={handleSignupChange} name="phone" placeholder='Phone number...' />
                    <Input value={signup.password} onChange={handleSignupChange} name="password" placeholder='Password' />
                    <Input value={signup.rpassword} onChange={handleSignupChange} name="rpassword" placeholder='Repeat password' />
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button onClick={() => {onClose(); handleSignupSubmit(); }} width="100px" variant={"outline"} colorScheme={"white"}>Sign Up</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
        </>
    )
}

