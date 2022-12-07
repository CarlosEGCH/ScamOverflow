import "../../styles/Login.css"

import { Button, Input } from '@chakra-ui/react'

export default function Login(){

    return(
        <>
            <div className="login-wrapper">
                <div className="login-container">
                    <div className="left-column">
                        <p className="title">Sign In</p>
                        <Input backgroundColor={"#ECF3F6"} placeholder='User Email' />
                        <Input backgroundColor={"#ECF3F6"} type="password" placeholder='Password' />
                        <p className="forgot">Forgot Your Password?</p>
                        <Button width="100px" colorScheme={"blue"} margin="0 auto" backgroundColor="#40ACFF" borderRadius={"24px"}>Sign In</Button>
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