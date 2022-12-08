import "./styles/App.css"

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Authentication/Login";
import Admins from "./components/Admins";
import Form from "./components/Tickets/Form"
import { useEffect, useState } from "react";

import Cookies from 'universal-cookie';

function App() {

  /**
   * Prioritized Functional Requirements
   * 1) Description of why the account was banned
   * 3) Allow admins to answer tickets
   * 5) Notify users after a ticket has been answered
   * 6) Allow admins to validate tickets that have been submitted
   * 7) Allow admins to delete posts
   * 8) Allow associates to report comments
   * 9) Allow users to edit their profile information
   * 10) Allow users to view the profile of the moderators
   * 
   */

  const cookies = new Cookies();
  const [logged, setLogged] = useState(false);


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
        console.log("Logged Successfully!")
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
  }, [])
  

  return (
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route index path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/open-ticket" element={logged ? <Form cookies={cookies} /> : <Login onRegister={handleRegister} cookies={cookies} />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;