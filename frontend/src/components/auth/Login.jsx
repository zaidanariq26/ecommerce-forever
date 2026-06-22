import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import SubmitButton from "../ui/SubmitButton";
import useAuthStore from "../../zustand/authStore";
import { ShopContext } from "../../context/ShopContext";

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { navigate } = useContext(ShopContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login({ email, password });

    setLoading(false);

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="xs:max-w-96 not-h-sm:py-16 flex w-full flex-col items-center gap-4 text-gray-800"
    >
      <div className="mb-2 inline-flex items-center gap-2">
        <p className="prata-regular text-2xl sm:text-3xl">Login</p>
        <hr className="h-[1.5px] w-8 border-none bg-gray-800" />
      </div>

      <div className="w-full">
        <label htmlFor="email" className="xs:text-lg mb-1 block text-base">
          Email
        </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email"
          value={email}
          className="w-full border border-gray-500 px-3 py-2"
          placeholder="email@example.com"
          required
        />
      </div>

      <div className="w-full">
        <label htmlFor="password" className="xs:text-lg mb-1 block text-base">
          Password
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

      <div className="-mt-2 flex w-full justify-between text-sm">
        <Link to="/forgot-password" className="cursor-pointer hover:underline">
          Forgot your password?
        </Link>
        <Link to="/register" className="cursor-pointer hover:underline">
          Create account
        </Link>
      </div>

      <SubmitButton
        className="mt-4"
        label="Sign In"
        type="loading"
        isLoading={loading}
      />
    </form>
  );
};

export default Login;
