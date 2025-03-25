import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./context/authContext"; 

const CLIENT_ID = "2t9loNQH90kzJcsFCODdigxfp325aq4z";


const Playlist = ({ playlistUrl }) => {
  const { username } = useContext(AuthContext);
  const [tracks, setTracks] = useState([]);
  const [saved, setSaved] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState("SoundCloud Playlist");

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch(
          `https://api.soundcloud.com/resolve?url=${playlistUrl}&client_id=${CLIENT_ID}`
        );
        const data = await response.json();
        setTracks(data.tracks || []);
        setPlaylistTitle(data.title || "SoundCloud Playlist");
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
      }
    };

    fetchPlaylist();
  }, [playlistUrl]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation SavePlaylist($url: String!, $title: String) {
              savePlaylistToUser(url: $url, title: $title) {
                id
                url
                title
              }
            }
          `,
          variables: {
            url: playlistUrl,
            title: playlistTitle, //  use actual playlist title
          },
        }),
      });

      const result = await response.json();
      console.log("GRAPHQL result:", result);

      if (result.data?.savePlaylistToUser) {
        setSaved(true);
      } else {
        alert("Failed to save playlist");
      }
    } catch (err) {
      alert("You must be logged in to save playlists.");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center">{playlistTitle}</h1>

      <iframe
        title="SoundCloud Player"
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        className="rounded-lg shadow-lg"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
          playlistUrl
        )}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
      ></iframe>

      {username && !saved && (
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Save to Profile
        </button>
      )}

      {saved && (
        <div className="text-green-600 font-semibold">
          ✅ Playlist saved to your profile!
        </div>
      )}

      <div className="mt-6 text-left">
        <h2 className="text-xl font-semibold mb-3">Playlist Tracks</h2>
        <ul className="space-y-2">
          {tracks.length > 0 ? (
            tracks.map((track, index) => (
              <li
                key={track.id}
                className="p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition"
              >
                <div className="font-medium">
                  {index + 1}. {track.title}
                </div>
                <div className="text-sm text-gray-500">{track.user.username}</div>
              </li>
            ))
          ) : (
            <p className="text-gray-600">Loading playlist...</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Playlist;
