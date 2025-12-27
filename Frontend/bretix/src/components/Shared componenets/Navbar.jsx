import { useNavigate } from "react-router-dom"

const Navbar = () =>{
    const navigate = useNavigate()
    return(
        <div>
            <button onClick={()=>{navigate("/")}}>Home</button>
            <button onClick={()=>{navigate("/Login")}}>Login</button>
            <button onClick={()=>{navigate("/register")}}>Register</button> 
            <button>Stores</button>
            <button onClick={()=>{navigate("/Proudects")}}>Products</button>
            <button>Contact Us</button>
            
        </div>
    )
}
export default Navbar