import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Lock } from "lucide-react";
import { AuthContext } from "../context/authContext";
import { jwtDecode } from "jwt-decode";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const registerMutation = `
      mutation RegisterUser($username: String!, $password: String!) {
        registerUser(username: $username, password: $password) {
          message
        }
      }
    `;

    const loginMutation = `
      mutation LoginUser($username: String!, $password: String!) {
        loginUser(username: $username, password: $password) {
          token
          message
        }
      }
    `;

    try {
      // 1. Register the user
      const regRes = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: registerMutation, variables: formData }),
      });

      const regData = await regRes.json();

      if (!regData.data?.registerUser) {
        throw new Error(regData.errors?.[0]?.message || "Registration failed");
      }

      // 2. Auto-login the user
      const loginRes = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: loginMutation, variables: formData }),
      });

      const loginData = await loginRes.json();

      if (!loginData.data?.loginUser?.token) {
        throw new Error("Login failed after registration");
      }

      const token = loginData.data.loginUser.token;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      login(decoded.username); // 🔥 update global context

      setSuccess("Account created and logged in!");
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Account</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <div className="relative">
              <UserPlus className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
