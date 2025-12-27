import { useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Shared componenets/Home";
import Navbar from "./components/Shared componenets/Navbar";
<<<<<<< HEAD
import Login from "./components/Shared componenets/Login";
import Register from "./components/Shared componenets/Register";
=======
import Login from "./components/Login";

>>>>>>> b68565972607588b525061fca6c4a8cc90f30a3e

 
function App() {
  return (
    <div>
      <h1>Bretix</h1>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </div>
  );
}

export default App;
