import { useCallback, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { useState } from "react";
import { useEffect } from "react";
import useAuthStore from "../zustand/authStore";
import api from "../api/axiosInstance";

const Orders = () => {
  const { currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const loadOrderData = useCallback(async () => {
    try {
      if (!isAuthenticated) return null;

      const response = await api.post("/api/order/userorders", {});

      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadOrderData();
  }, [isAuthenticated, loadOrderData]);

  return (
    <div className="min-h-screen pt-14">
      <div className="mb-3">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div className="divide-y divide-gray-300">
        {orderData.map((item, index) => (
          <div
            className="flex flex-col gap-4 border-gray-300 py-4 text-gray-700 first:border-t last:border-b md:flex-row md:items-center md:justify-between"
            key={index}
          >
            <div className="flex items-start gap-6">
              <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
              <div>
                <p className="font-medium">{item.name}</p>
                <div className="mt-1 flex items-center gap-3 text-base text-gray-700">
                  <p className="text-sm sm:text-base">
                    {currency}
                    {item.price}
                  </p>
                  <p className="text-sm sm:text-base">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm sm:text-base">Size: {item.size}</p>
                </div>
                <p className="mt-1 text-sm sm:text-base">
                  Date:{" "}
                  <span className="text-gray-400">
                    {new Date(item.date).toDateString()}
                  </span>
                </p>
                <p className="mt-1 text-sm sm:text-base">
                  Payment:{" "}
                  <span className="text-gray-400">{item.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div className="flex justify-between md:w-1/2">
              <div className="flex items-center gap-2">
                <p className="h-2 min-w-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <button
                onClick={loadOrderData}
                className="cursor-pointer rounded-sm border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-200"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
