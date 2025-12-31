import axios from "axios"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const AddNewProduct = ()=>{
    const navigate = useNavigate()

    const {id} = useParams()
    const [imgsrc,setImgSrc] = useState('')
    const [title,setTitle] = useState("")
    const [description,setDescription] = useState("")
    const [price,setPrice] = useState("")
    const [rate,setRate] = useState("")
    const [categories_id,setCategories_id] = useState("")
    const [store_id,setStore_id] = useState(id)

    const confirm = async () => {
        const newProductData = {imgsrc, title, description, price, rate, categories_id,}
        try{
            const response = await axios.post("http://localhost:5000/stores/addnewproductinstore", {...newProductData,store_id:store_id})
            navigate(`/${store_id}/allproducts`)
        }catch(err){console.log(err);
        }
    }

    return(
        <div>
            <input type="text" placeholder="Product Name" onChange={(e)=>{setTitle(e.target.value)}}/>
            <input type="text" placeholder="Description" onChange={(e)=>{setDescription(e.target.value)}}/>
            <input type="text" placeholder="Link of Image" onChange={(e)=>{setImgSrc(e.target.value)}}/>
            <input type="text" placeholder="Price" onChange={(e)=>{setPrice(e.target.value)}}/>
            <input type="text" placeholder="Rate" onChange={(e)=>{setRate(e.target.value)}}/>
            <input type="text" placeholder="Category of Product" onChange={(e)=>{setCategories_id(e.target.value)}}/>
            
            <button onClick={confirm}>Add the Product</button>
        </div>
    )
}
export default AddNewProduct