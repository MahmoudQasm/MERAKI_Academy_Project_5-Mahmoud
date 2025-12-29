import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const Store = ()=>{
    const {id} = useParams()
    const [store,setStore] = useState([])

    useEffect(()=>{
        axios.get(`http://localhost:5000/stores/${id}`)
        .then((res)=>{
            const storeData = res.data.result[0]
            console.log(storeData);
            
            setStore(storeData)
        })
        .catch((err)=>{console.log(err);
        })
    },[])
    console.log(store);
    
    return (
        <div>
            <img src={store.logo} alt={store.title} /><br />
            <h2>{store.title}</h2>
            <p>{store.description}</p>
            <span>{store.price}</span>
            <button>Add to Cart</button>
        </div>
    )
}
export default Store