import { useState } from "react";
import { Link } from "react-router-dom";
import SubmitButton from "../ui/SubmitButton";
import { forgotPassword } from "../../api/authApi";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword(email);

      console.log(response.data);
      if (response.data.success) {
        setEmail("");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleForgotPassword}
      className="xs:max-w-96 not-h-xs:py-16 flex w-full flex-col items-center gap-4 text-gray-800"
    >
      <div className="mb-2 inline-flex items-center gap-2">
        <p className="prata-regular text-2xl sm:text-3xl">Forgot Password</p>
        <hr className="h-[1.5px] w-8 border-none bg-gray-800" />
      </div>

      <p className="-mt-1 w-full text-center text-sm text-gray-500">
        If you forgot your password, enter your email below and we will send you
        a recovery link
      </p>

      <input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        value={email}
        className="w-full border border-gray-500 px-3 py-2"
        placeholder="email@example.com"
        required
      />

      <SubmitButton
        className="mt-2"
        label="Send Reset Email"
        type="loading"
        isLoading={loading}
      />

      <div className="flex w-full justify-center text-sm">
        <Link to="/login" className="cursor-pointer hover:underline">
          Back to Login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPassword;
