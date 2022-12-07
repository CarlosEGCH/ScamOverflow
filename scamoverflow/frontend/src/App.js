import "./styles/App.css"

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Authentication/Login";
import Admins from "./components/Admins";
import Form from "./components/Tickets/Form"
import { useState } from "react";

function App() {

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