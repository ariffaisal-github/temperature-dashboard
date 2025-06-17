import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center fixed top-0 left-0 z-50">
      <h1 className="text-xl font-semibold text-blue-600">
        🌡️ Temperature Tracker
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
