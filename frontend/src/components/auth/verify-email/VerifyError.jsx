import { Icon } from "@iconify/react";
import SubmitButton from "../../ui/SubmitButton";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import useResendVerificationEmail from "../../../hooks/useResendVerificationEmail";
import useAlertStore from "../../../zustand/alertStore";

const VerifyError = () => {
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [searchParams] = useSearchParams();
  const { resend } = useResendVerificationEmail();

  const showAlert = useAlertStore((state) => state.showAlert);

  // Handle resend verification email
  const handleResendEmail = async () => {
    const token = searchParams.get("token");

    setLoading(true);
    const result = await resend("", token, () => {
      setResendCooldown(30);
    });
    setLoading(false);

    if (!result.success) {
      showAlert({
        variant: "error",
        title: "Invalid Data",
        message: result.message || "Failed to resend verification email.",
        confirmLabel: "Go to Register",
        hideCancel: true,
        closeOnBackdropClick: false,
        onConfirm: () => window.location.replace("/register"),
      });
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
    </div>
  );
};

export default VerifyError;
