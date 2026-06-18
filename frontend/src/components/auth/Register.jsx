import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import SubmitButton from "../ui/SubmitButton";
import api from "../../api/axiosInstance";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/user/register", {
        firstName,
        lastName,
        email,
        password,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
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
      className="xs:max-w-96 not-h-sm:py-16 flex w-full flex-col items-center gap-4 text-gray-800"
      onSubmit={onSubmitHandler}
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
          required
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
          required
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
          required
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
