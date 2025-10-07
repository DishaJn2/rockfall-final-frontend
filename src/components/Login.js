import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaMountain, FaHardHat, FaHammer } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen 
      bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 
      relative overflow-hidden">

      {/* Subtle Background Doodles (Mining Theme) */}
      <div className="absolute top-16 left-16 text-7xl text-yellow-500/10">
        <FaMountain />
      </div>
      <div className="absolute bottom-20 right-16 text-7xl text-gray-400/10">
        <FaHardHat />
      </div>
      <div className="absolute bottom-10 left-1/4 text-6xl text-orange-400/10">
        <FaHammer />
      </div>

      {/* Login Card */}
      <div className="relative z-10 bg-slate-900/70 backdrop-blur-xl 
        p-10 rounded-3xl shadow-2xl w-96 border border-yellow-500/30 
        hover:border-yellow-400/50 transition duration-300">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 
            p-5 rounded-full shadow-lg transform hover:scale-110 
            transition duration-300">
            <FaMountain className="text-white text-4xl" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center 
          text-transparent bg-clip-text 
          bg-gradient-to-r from-yellow-400 to-orange-300 
          tracking-wide drop-shadow-lg">
          Rockfall Prediction System
        </h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Open-Pit Mine Safety Dashboard
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative group">
            <FaUser className="absolute left-3 top-3 text-gray-400 
              group-hover:text-yellow-400 transition" />
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full pl-10 pr-3 py-2 rounded-lg 
                bg-slate-800/80 text-white placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-yellow-400 
                group-hover:bg-slate-700 transition"
            />
          </div>

          <div className="relative group">
            <FaLock className="absolute left-3 top-3 text-gray-400 
              group-hover:text-yellow-400 transition" />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-10 pr-3 py-2 rounded-lg 
                bg-slate-800/80 text-white placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-yellow-400 
                group-hover:bg-slate-700 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="relative w-full py-3 rounded-lg 
              bg-gradient-to-r from-yellow-500 to-orange-500 
              text-white font-bold shadow-lg 
              overflow-hidden group hover:scale-[1.02] transition"
          >
            <span className="absolute inset-0 bg-white/20 opacity-0 
              group-hover:opacity-100 transition"></span>
            Access Dashboard
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
        </p>
      </div>
    </div>
  );
}

export default Login;
