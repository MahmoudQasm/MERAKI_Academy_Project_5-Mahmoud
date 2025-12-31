import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const ProductView = ()=>{
    const {productId} = useParams()
    const [product,setProduct]=useState([])

    // useEffect(()=>{
    //     axios.get
    // },[product])
    
    return (
        <div>

        </div>
    )

}
export default ProductView