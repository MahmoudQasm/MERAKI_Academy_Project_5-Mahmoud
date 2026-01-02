// مبيعات الاصناف حسب الكاتيجوري 
//

import axios from "axios"
import { useEffect, useState } from "react"

const Dashboard = ()=>{
    const [oreders,setOrders] = useState([])
    // useEffect(()=>{
    //     const getOrders = async ()=>{
    //         try{
    //             const result = await axios
    //         }
    //     }
    // },[])
    return (
        <div>
            <h2>Manager View</h2>
            <div>
                <div>Total Sales</div>
                <div>Total Orders</div>
                <div>Average Per Order</div>
                <div>Total Products</div>
            </div>
        </div>
    )
}
export default Dashboard