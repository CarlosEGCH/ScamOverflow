import "../../styles/Form.css"

import { Textarea, Select, Button } from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Form(props){

    const navigate = useNavigate();

    const [ticket, setTicket] = useState({category: "", description: ""});

    const handleTicketChange = (event) => {
      setTicket((prevState) => {
        return {
        ...prevState,
        [event.target.name]: event.target.value,
      }
      })
    }

    const handleTicketSubmit = () => {
      fetch(`http://localhost:8080/api/ticket-submit`, {
        method: 'POST',
        body: JSON.stringify({
            category: ticket.category,
            description: ticket.description
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${props.cookies.get('Bearer')}`
        }
      })
      .then(res => res.json())
      .then(data => {
        handleDiscardTicket();        
      })
      .then(() => {navigate('/');})
      .catch((e) => {
        console.log("Something went wrong ", e);
      })
    }

    const handleDiscardTicket = () => {
        setTicket({category: "", description: ""})
    }
    
    return(
        <>
            <div className="ticket-form-wrapper">
                <div className="ticket-form-container">
                    <p className="title">Report a Scam</p>
                    <Select value={ticket.category} onChange={handleTicketChange} name="category" placeholder="Select a Category..." className="input" backgroundColor={"#ECF3F6"} color={"#558491"}>
                        <option value='Online Shopping'>Online Shopping</option>
                        <option value='Phishing and Identity Theft'>Phishing and Identity Theft</option>
                        <option value='Cryptocurrency Scams'>Cryptocurrency Scams</option>
                        <option value='Hacking'>Hacking</option>
                        <option value='Fake Tech Support'>Fake Tech Support</option>
                        <option value='Fake Online Prizes'>Fake Online Prizes</option>
                        <option value='Malware Scams'>Malware Scams</option>
                    </Select>
                    <Textarea value={ticket.description} onChange={handleTicketChange} name="description" className="textarea" backgroundColor={"#ECF3F6"} placeholder="Description"></Textarea>
                    <div className="buttons">
                        <Button onClick={handleDiscardTicket} variant={"outline"} borderColor={"#1E2835"} >Discard</Button>
                        <Button onClick={handleTicketSubmit} colorScheme={"blue"}>Submit</Button> 
                    </div>    
                </div>
            </div>
        </>
    )
}