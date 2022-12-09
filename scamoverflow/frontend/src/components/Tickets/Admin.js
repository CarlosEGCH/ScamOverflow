import "../../styles/Admin.css"

import { useEffect, useState, useRef } from "react"

import ticketUser from "../../assets/ticket-user.svg"
import xIcon from "../../assets/xicon.svg"
import banTicket from "../../assets/banticket.svg"
import openChat from "../../assets/openchat.svg"
import checkIcon from "../../assets/check-square-broken.svg"

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  FormLabel,
  FormControl,
  Input,
  Button,
  useDisclosure
} from '@chakra-ui/react'

export default function Admin(){

    const [tickets, setTickets] = useState([]);

    const [loading, setLoading] = useState(true);

    const getTickets = () => {
      fetch(`http://localhost:8080/api/tickets`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        setTickets(data.tickets);
      })
      .then(() => setLoading(false))
      .catch((e) => {
        console.log("Something went wrong ", e);
      })
    }

    useEffect(() => {
        getTickets();
    }, [])

    return(
        <>
            <div className="admin-tickets-wrapper">
                <div className="admin-tickets-container">
                    <div className="left-column">
                        <p className="title">Unprocessed Tickets</p>
                        {loading ? <Spinner /> : tickets.map((ticket, key) => {
                            if(ticket.state == "new"){
                                return (<Ticket ticket={ticket} setLoading={setLoading} setTickets={setTickets} key={key} />)
                            }else{
                                return;
                            }
                        })}
                    </div>
                    <div className="middle-column">
                        <p className="title">Tickets in Analysis</p>
                        {loading ? <Spinner /> : tickets.map((ticket, key) => {
                            if(ticket.state == "processed"){
                                return (<Ticket ticket={ticket} setLoading={setLoading} setTickets={setTickets} key={key} />)
                            }else{
                                return;
                            }
                        })}
                    </div>
                    <div className="right-column">
                        <p className="title">Solved Tickets</p>
                        {loading ? <Spinner /> : tickets.map((ticket, key) => {
                            if(ticket.state == "solved"){
                                return (<Ticket ticket={ticket} key={key} />)
                            }else{
                                return;
                            }
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

function Ticket({ticket, setLoading, setTickets}){

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [answer, setAnswer] = useState("");

    const handleAnswerChange = (e) => {
      setAnswer(e.target.value)
    }

    const handleProcessTicket = () => {

        setLoading(true);

        fetch(`http://localhost:8080/api/process-ticket`, {
        method: 'POST',
        body: JSON.stringify({
            ticketid: ticket._id
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        setTickets(data.tickets);
        setLoading(false);
      })
      .catch((e) => {
        console.log("Something went wrong ", e);
      })

    }

    const handleAnswerTicket = () => {

        setLoading(true);

        fetch(`http://localhost:8080/api/answer-ticket`, {
        method: 'POST',
        body: JSON.stringify({
            ticketid: ticket._id,
            answer: answer
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        setTickets(data.tickets);
        setLoading(false);
      })
      .catch((e) => {
        console.log("Something went wrong ", e);
      })

    }


    
    if(ticket.state == "new"){
        return(
            <>
            <div className="ticket-wrapper">
                <div className="header">
                    <img src={ticketUser} alt="user-image" />
                    <p>{ticket.name}</p>
                    <img className="x-icon" src={xIcon} />
                </div>
                <p className="category">Category: {ticket.category}</p>
                <p className="description">{ticket.description}</p>
                <p className="date">October 22, 2022</p>
                <div className="footer">
                    <img src={checkIcon} onClick={handleProcessTicket} />
                    <img src={banTicket} />
                    <img src={openChat} />
                </div>
            </div>
        </>
    )
    }else if(ticket.state == "processed"){
            
        return(
        <>
            <div className="ticket-wrapper">
                <div className="header">
                    <img src={ticketUser} alt="user-image" />
                    <p>{ticket.name}</p>
                    <img className="x-icon" src={xIcon} />
                </div>
                <p className="category">Category: {ticket.category}</p>
                <p className="description">{ticket.description}</p>
                <p className="date">October 22, 2022</p>
                <div className="footer">
                    <img src={checkIcon} onClick={onOpen} />
                    <img src={banTicket} />
                    <img src={openChat} />
                </div>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Create your account</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>

                    <FormControl mb={"10px"}>
                    <FormLabel>Ticket Category:</FormLabel>
                    <p>{ticket.category}</p>
                    </FormControl>

                    <FormControl mb={"10px"}>
                    <FormLabel>Ticket Description:</FormLabel>
                    <p>{ticket.description}</p>
                    </FormControl>

                    <FormControl mt={4}>
                    <FormLabel>Answer</FormLabel>
                    <Input placeholder='Write an answer...' name="answer" value={answer} onChange={handleAnswerChange} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={() => {onClose(); handleAnswerTicket();}} colorScheme='blue' mr={3}>
                    Answer
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
            </div>

        </>
    )
    }else{
        return(
        <>
            <div className="ticket-wrapper">
                <div className="header">
                    <img src={ticketUser} alt="user-image" />
                    <p>{ticket.name}</p>
                    <img className="x-icon" src={xIcon} />
                </div>
                <p className="category">Category: {ticket.category}</p>
                <p className="description">{ticket.description}</p>
                <p className="date">October 22, 2022</p>
                <div className="footer">
                    {/*<img src={checkIcon} onClick={() => {console.log("Deleted")}} />
                    <img src={banTicket} />
                    <img src={openChat} />*/}
                </div>
            </div>
        </>
    )
    }
}