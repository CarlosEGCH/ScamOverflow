import "./styles/App.css"

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Authentication/Login";
import Admins from "./components/Admins";
import Form from "./components/Tickets/Form"
import { useState } from "react";

function App() {

  /**
   * Prioritized Functional Requirements
   * 1) Description of why the account was banned
   * 2) Create a Ticket
   * 3) Allow admins to answer tickets
   * 4) Allow new users to create an account
   * 5) Notify users after a ticket has been answered
   * 6) Allow admins to validate tickets that have been submitted
   * 7) Allow admins to delete posts
   * 8) Allow associates to report comments
   * 9) Allow users to edit their profile information
   * 10) Allow users to view the profile of the moderators
   * 
   */

  const [logged, setLogged] = useState(false);

  return (
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route index path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/open-ticket" element={logged ? <Form /> : <Login />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;