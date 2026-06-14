import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="xs:max-w-96 flex w-full flex-col items-center gap-4 text-gray-800">
      <div className="mb-2 inline-flex items-center gap-2">
        <p className="prata-regular text-2xl sm:text-3xl">Login</p>
        <hr className="h-[1.5px] w-8 border-none bg-gray-800" />
      </div>

      <input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        value={email}
        className="w-full border border-gray-500 px-3 py-2"
        placeholder="email@example.com"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        value={password}
        className="w-full border border-gray-500 px-3 py-2"
        placeholder="••••••••"
        required
      />
      <div className="-mt-2 flex w-full justify-between text-sm">
        <Link to="/forgot-password" className="cursor-pointer hover:underline">
          Forgot your password?
        </Link>
        <Link to="/register" className="cursor-pointer hover:underline">
          Create account
        </Link>
      </div>
      <button className="mt-4 w-full cursor-pointer bg-gray-900 px-8 py-2 font-light text-white hover:bg-gray-800">
        Sign In
      </button>
    </form>
  );
};

export default Login;
