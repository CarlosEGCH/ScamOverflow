import "./styles/App.css"

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Admins from "./components/Admins";

function App() {


  return (
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route index path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admins" element={<Admins />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;