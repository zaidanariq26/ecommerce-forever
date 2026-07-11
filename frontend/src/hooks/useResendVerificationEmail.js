import { useState } from "react";
import { toast } from "react-toastify";
import { resendVerifyEmail } from "../api/authApi";

const useResendVerificationEmail = () => {
  const [isResending, setIsResending] = useState(false);

  const resend = async (email, token, onSuccess) => {
    try {
      setIsResending(true);
      const response = await resendVerifyEmail({ email, token });

      if (response.data.success) {
        toast.success(response.data.message);
        onSuccess?.();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message };
    } finally {
      setIsResending(false);
    }
  };

  return { resend, isResending };
};

export default useResendVerificationEmail;
