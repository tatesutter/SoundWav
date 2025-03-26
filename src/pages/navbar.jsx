import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";

const Navbar = ({ darkMode, setDarkMode }) => {
  const { username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 fixed top-0 left-0 right-0 z-50 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-orange-500 dark:text-orange-400">
        SoundWav
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/search-users" className="text-sm text-orange-500 dark:text-orange-400 hover:underline">
          Find Users
        </Link>
        <Link to="/search" className="text-sm text-orange-500 dark:text-orange-400 hover:underline">
          Search
        </Link>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-sm px-3 py-1 border rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white transition"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        {username ? (
          <>
            <Link
              to="/profile"
              className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              {username}'s Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="text-sm border border-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900 text-orange-500 px-4 py-2 rounded-lg"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
