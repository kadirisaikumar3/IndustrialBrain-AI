import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, LogIn } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", formData);

      // Clear previous user's cached data
      localStorage.clear();

      // Save new token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);

      toast.success("Login successful!");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-theme flex items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md rounded-3xl card-bg border border-theme p-8 shadow-2xl">

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">
            Welcome Back
          </h1>

          <p className="mt-3 text-secondary">
            Sign in to your IndustrialBrain AI account.
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="mb-2 block font-medium text-primary">
              Email
            </label>

            <div className="flex items-center rounded-xl border border-theme search-box px-4">
              <User
                size={20}
                className="text-cyan-500"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-transparent p-4 text-primary placeholder:text-secondary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium text-primary">
              Password
            </label>

            <div className="flex items-center rounded-xl border border-theme search-box px-4">
              <Lock
                size={20}
                className="text-cyan-500"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-transparent p-4 text-primary placeholder:text-secondary outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 font-semibold text-primary transition-all duration-300 hover:scale-[1.02]"
          >
            <LogIn size={20} />
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-secondary">
          Don't have an account?

          <Link
            to="/register"
            className="ml-2 font-semibold text-cyan-500 transition hover:text-cyan-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;