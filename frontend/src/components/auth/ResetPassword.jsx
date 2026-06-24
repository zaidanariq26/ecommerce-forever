import { useContext, useState } from "react";
import SubmitButton from "../ui/SubmitButton";
import { toast } from "react-toastify";
import { resetPassword } from "../../api/authApi";
import { useSearchParams } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { navigate } = useContext(ShopContext);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const token = searchParams.get("token");

    if (!token) {
      toast.error("Invalid or missing reset link");
      return;
    }

    if (!password || !passwordConfirmation) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match. Please check again!");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword({
        token,
        password,
        passwordConfirmation,
      });

      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          onClose: () => {
            navigate("/login", { replace: true });
          },
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleResetPassword}
      className="xs:max-w-96 flex w-full flex-col items-center gap-4 text-gray-800"
    >
      <div className="mb-2 inline-flex items-center gap-2">
        <p className="prata-regular text-2xl sm:text-3xl">Reset Password</p>
        <hr className="h-[1.5px] w-8 border-none bg-gray-800" />
      </div>

      <p className="-mt-1 w-full text-center text-sm text-gray-500">
        Let&apos;s get you back in! Please enter a new password below to regain
        access to your account.
      </p>

      <div className="w-full">
        <label htmlFor="password" className="xs:text-lg mb-1 block text-base">
          New Password
        </label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
          value={password}
          className="w-full border border-gray-500 px-3 py-2"
          placeholder="••••••••"
          required
        />
      </div>

      <div className="w-full">
        <label
          htmlFor="passwordConfirmation"
          className="xs:text-lg mb-1 block text-base"
        >
          Confirm New Password
        </label>
        <input
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          type="password"
          id="passwordConfirmation"
          value={passwordConfirmation}
          className="w-full border border-gray-500 px-3 py-2"
          placeholder="••••••••"
          required
        />
      </div>

      <SubmitButton
        className="mt-2"
        label="Reset Password"
        type="loading"
        isLoading={loading}
      />
    </form>
  );
};

export default ResetPassword;
