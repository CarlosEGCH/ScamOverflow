
import "../styles/Navbar.css"
import { useViewport } from '../hooks/responsive.js';

import messageIcon from "../assets/message-square-plus.svg"
import ticketIcon from "../assets/mail-03.svg"
import bellIcon from "../assets/bell-03.svg"
import userIcon from "../assets/user-profile-02.svg"
import pageLogo from "../assets/scamoverflowlogo.png"
import menuIcon from "../assets/menu-05.svg"

import React from "react";

import { useNavigate } from "react-router-dom";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  useDisclosure
} from '@chakra-ui/react'

export default function Navbar(props){

  const { width } = useViewport();

    return(
        <>
            {width > 900 ? <Desktop userId={props.userId} /> : <Mobile />}
        </>
    )
}

function Desktop(props){

    const navigate = useNavigate();

    return(
        <div className="navbar-wrapper">
            <div className="navbar-container">
                <div className="navbar-logo" onClick={() => navigate("/")}>
                    <img src={pageLogo} />
                    <p>ScamOverflow</p>
                </div>
                <div className="navbar-links">
                    <ul>
                        <li onClick={() => navigate("/open-ticket")}>
                            <img src={messageIcon} />
                            <p>Report Scam</p>
                        </li>
                        <li onClick={() => navigate("/tickets")}>
                            <img src={ticketIcon} />
                            <p>Tickets</p>
                        </li>
                    </ul>
                </div>
                <div className="navbar-options">
                    <ul>
                        <li>
                            <img src={bellIcon} />
                        </li>
                        <li onClick={() => navigate("/profile/" + props.userId)}>
                            <img src={userIcon} />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

function Mobile(){

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

    return(
        <div className="navbar-mobile-wrapper">
            <div className="navbar-mobile-container">
                <div className="navbar-mobile-logo">
                    <img src={pageLogo} />
                </div>
                <Button ref={btnRef} colorScheme={"transparent"} onClick={onOpen}>
                    <img src={menuIcon} />
                </Button>
                <Drawer
                    isOpen={isOpen}
                    placement='right'
                    onClose={onClose}
                    finalFocusRef={btnRef}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Create your account</DrawerHeader>

                    <DrawerBody>
                        <Input placeholder='Type here...' />
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                        Cancel
                        </Button>
                        <Button colorScheme='blue'>Save</Button>
                    </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    )
}