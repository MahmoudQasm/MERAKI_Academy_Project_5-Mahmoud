import { useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Shared componenets/Home";
import Navbar from "./components/Shared componenets/Navbar";
import Login from "./components/Login";


function App() {
  return (
    <div>
      <h1>hello world</h1>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
