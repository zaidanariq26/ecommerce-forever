import { useState } from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form className="xs:max-w-96 flex w-full flex-col items-center gap-4 text-gray-800">
      <div className="mb-2 inline-flex items-center gap-2">
        <p className="prata-regular text-2xl sm:text-3xl">Reset Password</p>
        <hr className="h-[1.5px] w-8 border-none bg-gray-800" />
      </div>

      <p className="-mt-1 w-full text-center text-sm text-gray-500">
        Let&apos;s get you back in! Please enter a new password below to regain
        access to your account.
      </p>

      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        value={password}
        className="w-full border border-gray-500 px-3 py-2"
        placeholder="New password"
        required
      />
      <input
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        value={confirmPassword}
        className="w-full border border-gray-500 px-3 py-2"
        placeholder="Confirm new password"
        required
      />

      <button className="mt-2 w-full cursor-pointer bg-gray-900 px-8 py-2 font-light text-white hover:bg-gray-800">
        Reset Password
      </button>

      <div className="flex w-full justify-center text-sm">
        <Link to="/login" className="cursor-pointer hover:underline">
          Back to Login
        </Link>
      </div>
    </form>
  );
};

export default ResetPassword;
