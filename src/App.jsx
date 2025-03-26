import React, { useEffect, useState } from "react";
import Navbar from "./pages/navbar";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/signup";
import Login from "./pages/login";
import Profile from "./pages/profile";
import PlaylistPage from "./pages/playlistPage";
import Search from "./pages/search";
import SearchUsers from "./pages/searchUsers";
import UserProfile from "./pages/userProfile";
import Friends from "./pages/friends";
import demoGif from "./assets/demo.gif";
import "./index.css"; // make sure Tailwind is set up for dark mode

const Landing = () => (
  <div className="relative overflow-hidden text-center max-w-2xl mx-auto mt-12">
    <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-300 mb-4">🎧 Welcome to SoundWav</h1>
    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
      SoundWav lets you share and save SoundCloud playlists and tracks. Explore other users, follow them, and keep your favorite music in one place.
    </p>

    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
      <a href="/search" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition">🔍 Search Playlists</a>
      <a href="/search-users" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">👥 Search Users</a>
    </div>

    <div className="mt-4">
      <img
        src={demoGif}
        alt="App demo"
        className="rounded-xl shadow-lg mx-auto max-w-full w-full sm:w-[500px]"
      />
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">See how SoundWav works in action</p>
    </div>

    <footer>
      <div className="mt-24 border-t pt-6 text-sm text-gray-500 dark:text-gray-400">
        Built with ❤️ by music lovers. Start sharing your playlists today.
      </div>
    </footer>
  </div>
);

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`${darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="pt-20 px-6 py-8 text-center min-h-screen">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search-users" element={<SearchUsers />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/profile/friends" element={<Friends />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
