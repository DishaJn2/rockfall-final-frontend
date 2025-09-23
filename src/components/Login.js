import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

function Login() {
  const [role, setRole] = useState("Field Worker");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Redirect based on role
    if (role === "Field Worker") {
      navigate("/dashboard");
    } else if (role === "Admin") {
      navigate("/admin-dashboard");
    } else if (role === "Supervisor") {
      navigate("/supervisor-dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 via-purple-700 to-indigo-800">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-96">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-full">
            <FaUser className="text-white text-3xl" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white">
          Rockfall Prediction System
        </h2>
        <p className="text-center text-gray-200 mb-6 text-sm">
          Open-Pit Mine Safety Dashboard
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Role Selector */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full py-2 px-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="Field Worker">Field Worker</option>
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor</option>
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition"
          >
            Access Dashboard
          </button>
        </form>

        <p className="text-center text-gray-300 text-xs mt-4">
          Demo credentials: Any username / password
        </p>
      </div>
    </div>
  );
}

export default Login;
