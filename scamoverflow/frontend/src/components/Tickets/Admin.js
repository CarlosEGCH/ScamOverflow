import "../../styles/Admin.css"

import { useEffect, useState } from "react"

import ticketUser from "../../assets/ticket-user.svg"
import xIcon from "../../assets/xicon.svg"
import banTicket from "../../assets/banticket.svg"
import openChat from "../../assets/openchat.svg"

import { Spinner } from '@chakra-ui/react'

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
                                return (<Ticket ticket={ticket} key={key} />)
                            }else{
                                return;
                            }
                        })}
                    </div>
                    <div className="middle-column">
                        <p className="title">Tickets in Analysis</p>
                        {loading ? <Spinner /> : tickets.map((ticket, key) => {
                            if(ticket.state == "processed"){
                                return (<Ticket ticket={ticket} key={key} />)
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

function Ticket({ticket}){

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
                    <img src={banTicket} />
                    <img src={openChat} />
                </div>
            </div>
        </>
    )
}