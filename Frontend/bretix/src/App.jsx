import { useEffect, useState } from "react";
import {
  Route,
  Routes,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Home from "./components/Shared componenets/Home";
import Navbar from "./components/Shared componenets/Navbar";
import Login from "./components/Shared componenets/Login";
import Register from "./components/Shared componenets/Register";
import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import ImgSlider from "./components/ImgSlider";
import Stores from "./components/Shared componenets/Stores";
import Store from "./components/Shared componenets/Store";


function App() {
  const [showNav, setShowNav] = useState(true);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.toLowerCase().includes("/products")) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }, [location.pathname]);
  return (
    <div>

      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              {" "}
              <ImgSlider /> <br /> <Stores />  <br /> <Home />
            </>
          }
        />
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/stores" element={<Stores/>}/>
        <Route path="/stores/:id" element={<Store/>}/>
      </Routes>
    </div>
  );
}

export default App;
