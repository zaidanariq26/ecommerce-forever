import { Icon } from "@iconify/react";
import SubmitButton from "../../ui/SubmitButton";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import AlertDialog from "../../ui/AlertDialog";
import { resendVerifyEmail } from "../../../api/authApi";

const VerifyError = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [alertConfig, setAlertConfig] = useState(null);

  const closeAlert = () => setAlertConfig(null);

  // Handle resend verification email
  const handleResendEmail = async () => {
    const token = searchParams.get("token");

    try {
      setLoading(true);
      const response = await resendVerifyEmail(token);

      if (response.data.success) {
        toast.success(response.data.message);
        setResendCooldown(30);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setAlertConfig({
        variant: "error",
        title: "Invalid Token",
        message: message,
        confirmLabel: "Go to Register",
        hideCancel: true,
        closeOnBackdropClick: false,
        onConfirm: () => window.location.replace("/register"),
      });
      return;
    } finally {
      setLoading(false);
    }
  };

  // Handle resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  return (
    <div className="xs:max-w-96 flex w-full flex-col items-center text-gray-800">
      <div className="xs:size-18 flex size-16 items-center justify-center rounded-full bg-red-800">
        <Icon
          icon="radix-icons:cross-2"
          className="xs:text-4xl text-3xl text-gray-100"
        />
      </div>

      <p className="prata-regular xs:text-2xl mt-6 text-xl">
        Link Invalid or Expired
      </p>
      <p className="xs:text-base mt-2 text-center text-sm font-light text-gray-600">
        This verification link is no longer valid. Please request a new one.
      </p>

      <SubmitButton
        onClick={handleResendEmail}
        className="mt-8"
        label="Resend Verification Email"
        type="loading"
        disabled={resendCooldown > 0}
        isLoading={loading}
      />

      <div
        className={
          resendCooldown <= 0
            ? "hidden"
            : "mt-4 flex w-full justify-center text-xs font-light text-gray-500"
        }
      >
        You can resend again in {resendCooldown}s
      </div>

      <AlertDialog
        isOpen={!!alertConfig}
        onClose={closeAlert}
        onConfirm={alertConfig?.onConfirm}
        variant={alertConfig?.variant}
        title={alertConfig?.title}
        message={alertConfig?.message}
        confirmLabel={alertConfig?.confirmLabel}
        closeOnBackdropClick={alertConfig?.closeOnBackdropClick}
        hideCancel={alertConfig?.hideCancel}
      />
    </div>
  );
};

export default VerifyError;
