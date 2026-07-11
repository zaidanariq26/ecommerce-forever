import { useState } from "react";
import { Link } from "react-router-dom";
import SubmitButton from "../ui/SubmitButton";
import useAuthStore from "../../zustand/authStore";
import { toast } from "react-toastify";
import useResendVerificationEmail from "../../hooks/useResendVerificationEmail";
import useAlertStore from "../../zustand/alertStore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const { resend } = useResendVerificationEmail();
  const showAlert = useAlertStore((state) => state.showAlert);
  const register = useAuthStore((state) => state.register);

  const handleResendEmail = async () => {
    await resend(email, "");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!firstName.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    const result = await register({ firstName, lastName, email, password });
    setLoading(false);

    if (result.success) {
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
    }

    if (result.errorType === "EMAIL_NOT_VERIFIED") {
      showAlert({
        variant: "warning",
        title: "Email Is Not Verified",
        message: result.errorMessage,
        confirmLabel: "Send Verification Email",
        hideCancel: true,
        onConfirm: handleResendEmail,
      });
    }
  };

  return (
    <form
      className="xs:max-w-96 not-h-sm:py-16 flex w-full flex-col items-center gap-4 text-gray-800"
      onSubmit={handleRegister}
    >
      <div className="mb-2 inline-flex items-center gap-2">
        <p className="prata-regular text-2xl sm:text-3xl">Register</p>
        <hr className="h-[1.5px] w-8 border-none bg-gray-800" />
      </div>

      <div className="w-full">
        <label htmlFor="firstName" className="xs:text-lg mb-1 block text-base">
          First Name
        </label>

        <input
          disabled={loading}
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
          id="firstName"
          className="w-full border border-gray-500 px-3 py-2"
          placeholder="First Name"
        />
      </div>

      <div className="w-full">
        <label htmlFor="lastName" className="xs:text-lg mb-1 block text-base">
          Last Name
        </label>

        <input
          disabled={loading}
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
          id="lastName"
          className="w-full border border-gray-500 px-3 py-2"
          placeholder="Last Name"
        />
      </div>

      <div className="w-full">
        <label htmlFor="email" className="xs:text-lg mb-1 block text-base">
          Email
        </label>

        <input
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email"
          value={email}
          className="w-full border border-gray-500 px-3 py-2"
          placeholder="email@example.com"
        />
      </div>

      <div className="w-full">
        <label htmlFor="password" className="xs:text-lg mb-1 block text-base">
          Password
        </label>

        <input
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
          value={password}
          className="w-full border border-gray-500 px-3 py-2"
          placeholder="••••••••"
        />
      </div>
      <div className="-mt-2 flex w-full justify-between text-sm">
        <p>Already have an account?</p>
        <Link to="/login" className="cursor-pointer hover:underline">
          Login here
        </Link>
      </div>
      <SubmitButton
        className="mt-4"
        label="Sign Up"
        type="loading"
        isLoading={loading}
      />
    </form>
  );
};

export default Register;
