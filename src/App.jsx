import React from "react";
import Navbar from "./pages/navbar";
import Playlist from "./Playlist";
import Register from "./pages/signup";
import Login from "./pages/login";
import { Routes, Route } from "react-router-dom";
import Profile from "./pages/profile";
import PlaylistPage from './pages/playlistPage';
import Search from "./pages/search";
import SearchUsers from "./pages/searchUsers";
import UserProfile from "./pages/userProfile";
import Friends from "./pages/friends";


const App = () => {
  const playlistUrl =
    "https://api.soundcloud.com/playlists/1962821612";

  return (
    <>
      <Navbar />
      <div className="pt-20 px-6 py-8 text-center">
        <Routes>
          <Route path="/" element={<Playlist playlistUrl={playlistUrl} />} />
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
    </>
  );
};

export default App;

