import { useEffect, useRef, useState } from "react";
import VerifyLoading from "./verify-email/VerifyLoading.jsx";
import VerifySuccess from "./verify-email/VerifySuccess.jsx";
import VerifyError from "./verify-email/VerifyError.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuthStore from "../../zustand/authStore.js";
import { toast } from "react-toastify";
import api from "../../api/axiosInstance.js";

const VerifyEmail = () => {
  const [status, setStatus] = useState("loading");
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const intervalRef = useRef(null);

  // Hit API verify-email
  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const response = await api.get("/api/user/verify-email", {
          params: { token },
        });

        if (response.data.success) {
          console.log(response.data);
          login({
            user: response.data.user,
            accessToken: response.data.accessToken,
          });

          setStatus("success");
        } else {
          setStatus("error");
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        setStatus("error");
        toast.error(error.response?.data?.message || error.message);
      }
    };

    verifyEmail();
  }, []);

  // Activate countdown
  useEffect(() => {
    if (status !== "success") return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [status]);

  // Handle Go to Homepage button
  const handleGoHome = () => {
    clearInterval(intervalRef.current);
    navigate("/");
  };

  const renderContent = () => {
    if (status === "loading") return <VerifyLoading />;
    if (status === "success")
      return <VerifySuccess countdown={countdown} onGoHome={handleGoHome} />;
    if (status === "error") return <VerifyError />;
  };

  return <div className="not-h-xs:py-16">{renderContent()}</div>;
};

export default VerifyEmail;
