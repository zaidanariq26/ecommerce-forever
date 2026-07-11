import { useEffect, useRef, useState } from "react";
import VerifyLoading from "./verify-email/VerifyLoading.jsx";
import VerifySuccess from "./verify-email/VerifySuccess.jsx";
import VerifyError from "./verify-email/VerifyError.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuthStore from "../../zustand/authStore.js";

const VerifyEmail = () => {
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const [status, setStatus] = useState("loading");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const intervalRef = useRef(null);

  // Hit API verify-email
  useEffect(() => {
    const handleVerifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        return;
      }

      const result = await verifyEmail(token);

      setStatus(result.success ? "success" : "error");
    };

    handleVerifyEmail();
  }, [searchParams, verifyEmail]);

  // Activate countdown
  useEffect(() => {
    if (status !== "success") return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [navigate, status]);

  // Handle Go to Homepage button
  const handleGoHome = () => {
    clearInterval(intervalRef.current);
    navigate("/", { replace: true });
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
