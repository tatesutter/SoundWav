import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const { username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 fixed top-0 left-0 right-0 z-50 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-orange-500">
        SoundCloud Viewer
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/search"
          className="text-sm text-orange-500 hover:underline"
        >
          Search
        </Link>

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
              className="text-sm border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 transition"
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
              className="text-sm border border-orange-500 hover:bg-orange-100 text-orange-500 px-4 py-2 rounded-lg"
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
