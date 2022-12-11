
import "../styles/Navbar.css"
import { useViewport } from '../hooks/responsive.js';

import messageIcon from "../assets/message-square-plus.svg"
import ticketIcon from "../assets/mail-03.svg"
import bellIcon from "../assets/bell-03.svg"
import userIcon from "../assets/user-profile-02.svg"
import pageLogo from "../assets/scamoverflowlogo.png"
import menuIcon from "../assets/menu-05.svg"

import React, { useEffect, useState } from "react";

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

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from '@chakra-ui/react'

import { Badge } from '@chakra-ui/react'

export default function Navbar(props){

  const { width } = useViewport();

    return(
        <>
            {width > 900 ? <Desktop role={props.role} cookies={props.cookies} userid={props.userid} logged={props.logged} tickets={props.solvedTickets} /> : <Mobile />}
        </>
    )
}

function Desktop(props){

    const navigate = useNavigate();

    const handleLogout = () => {
        props.cookies.remove("Bearer");
        navigate(0);
    }

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
                        {props.role == "admin" ? <li onClick={() => navigate("/tickets")}>
                            <img src={ticketIcon} />
                            <p>Tickets</p>
                        </li> : ""}
                    </ul>
                </div>
                <div className="navbar-options">
                    <ul>
                        <li>
                            {props.logged ? <Popover>
                            <PopoverTrigger>
                                    <div>
                                        <img src={bellIcon} />
                                        <Badge style={{position: "absolute", transform: "translate(-10px, -5px)", fontSize: "12px", background: "#40ACFF"}}>{props.tickets.length}</Badge>
                                    </div>
                            </PopoverTrigger>
                            <PopoverContent fontSize="18px" color="black">
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader fontWeight="500">Notifications:</PopoverHeader>
                                <PopoverBody>
                                    {props.tickets.map((ticket, key) => {
                                        if(ticket.answer != ""){
                                            return (<Ticket ticket={ticket} key={key} />);
                                        }
                                        return "";
                                    })}
                                </PopoverBody>
                            </PopoverContent>
                            </Popover> : ""}
                        </li>
                        <li onClick={() => {navigate("/profile/" + props.userid)}}>
                            <img src={userIcon} />
                        </li>
                        {props.logged ? <Button color="black" onClick={handleLogout}>Logout</Button> : ""}
                    </ul>
                </div>
            </div>
        </div>
    )
}

function Ticket({ticket}){

    return(
        <>
            <div className="ticket-wrapper">
                <p className="alert">Ticket Answered!</p>
                <p className="category">Category: {ticket.category}</p>
                <p className="description">Description: {ticket.description}</p>
                <p className="description">Answer: {ticket.answer}</p>
            </div>
        </>
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