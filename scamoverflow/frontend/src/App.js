import "./styles/App.css"

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Authentication/Login";
import Admins from "./components/Admins";
import Form from "./components/Tickets/Form";
import Admin from "./components/Tickets/Admin";
import Profile from "./components/Profiles/Profile";
import { useEffect, useState } from "react";

import Cookies from 'universal-cookie';

function App() {

  /**
   * Prioritized Functional Requirements
   * 5) Notify users after a ticket has been answered
   * 
   */

  const cookies = new Cookies();
  const [logged, setLogged] = useState(false);
  const [userId, setUserId] = useState("0");
  const [loading, setLoading] = useState(true);

  const [solvedTickets, setSolvedTickets] = useState([]);

    const getSolvedTickets = () => {

      setLoading(true);

      fetch(`http://localhost:8080/api/get-user-solved-tickets`, {
          method: 'POST',
          body: JSON.stringify({
            userid: userId
          }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then((data) => {
          setSolvedTickets(data.tickets);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          console.log("Something went wrong ", e);
        })
    }

  const handleRegister = async () => {
    try {

      if(cookies.get('Bearer') != null){

        await fetch(`http://localhost:8080/api/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('Bearer')}`
        }
      })
      .then(res => res.json())
      .then( async (data) => {
        setLogged(true);
        setUserId(data._id);
      })
      .catch((e) => {
        console.log('Fetching error: ', e);
      })
      }

    } catch (e) {
      console.log('Erro encontrado: ', e);
    }
  }

  useEffect(() => {
      handleRegister();
      getSolvedTickets();
  }, [loading])
  

  return (
      <BrowserRouter>
      <Navbar userid={userId} logged={logged} solvedTickets={solvedTickets} />
        <Routes>
          <Route index path="/" element={<Dashboard cookies={cookies} />} />
          <Route path="/login" element={<Login onRegister={handleRegister} cookies={cookies} />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/open-ticket" element={logged ? <Form cookies={cookies} /> : <Login onRegister={handleRegister} cookies={cookies} />} />
          <Route path="/tickets" element={logged ? <Admin cookies={cookies} /> : <Login onRegister={handleRegister} cookies={cookies} />} />
          <Route path="/profile/:userid" element={logged ? <Profile cookies={cookies} /> : <Login onRegister={handleRegister} cookies={cookies} />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;