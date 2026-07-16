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

    const response = await API.post(
      "/auth/login",
      formData
    );

    localStorage.setItem(
      "token",
      response.data.token
    );

    toast.success("Login successful!");

    navigate("/dashboard");

  } catch (error) {

    console.error(error);

    toast.error("Invalid email or password.");

  }
};
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">

        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Login
        </h1>

        <form
  className="space-y-5"
  onSubmit={handleSubmit}
>

          <div>

            <label className="text-slate-300 block mb-2">
              Email
            </label>

            <div className="flex items-center bg-slate-700 rounded-lg px-3">

              <User className="text-cyan-400" size={20} />

              <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Enter your email"
  className="w-full bg-transparent p-3 outline-none text-white"
/>

            </div>

          </div>

          <div>

            <label className="text-slate-300 block mb-2">
              Password
            </label>

            <div className="flex items-center bg-slate-700 rounded-lg px-3">

              <Lock className="text-cyan-400" size={20} />

              <input
  type="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Enter your password"
  className="w-full bg-transparent p-3 outline-none text-white"
/>

            </div>

          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold py-3 rounded-lg transition"
          >
            <LogIn size={20} />
            Login
          </button>

        </form>

        <p className="text-center text-slate-400 mt-6">

          Don't have an account?

          <Link
            to="/register"
            className="text-cyan-400 ml-2 hover:underline"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;