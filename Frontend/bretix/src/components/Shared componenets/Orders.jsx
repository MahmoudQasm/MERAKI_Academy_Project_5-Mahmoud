import axios from "axios";
import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/cart/getCartWhereIsDeletedTure`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      })
      .then((result) => {
      
        console.log(result.data.items);
        setOrders(result.data.items || []);
        setIsDeleted(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        جاري تحميل طلباتك...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            سجل الطلبات
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            شكراً لثقتك بنا، هنا تجد تفاصيل جميع مشترياتك السابقة.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-400">لا يوجد طلبات حالياً</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row justify-between items-center"
              >
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="h-16 w-16 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {item.items || "منتج غير محدد"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      رقم الطلب: #ORD-{Math.floor(Math.random() * 10000)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <span className="px-4 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    تم التسليم
                  </span>
                  <p className="text-lg font-bold text-indigo-600 mt-2">
                    {item.price ? `${item.price} JOD` : "السعر متوفر عند الدفع"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
