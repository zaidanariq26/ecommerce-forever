import { useContext, useEffect, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";
import useAuthStore from "../zustand/authStore";

const Verify = () => {
  const { navigate, setCartItems } = useContext(ShopContext);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = useCallback(async () => {
    try {
      if (!isAuthenticated) return null;

      const response = await api.post("/api/order/verifyStripe", {
        success,
        orderId,
      });

      if (response.data.success) {
        setCartItems({});
        navigate("/orders");
      } else {
        navigate("/cart");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [isAuthenticated, success, orderId, setCartItems, navigate]);

  useEffect(() => {
    verifyPayment();
  }, [isAuthenticated, verifyPayment]);

  return <div></div>;
};

export default Verify;
