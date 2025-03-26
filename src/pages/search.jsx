import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";

const CLIENT_ID = "2t9loNQH90kzJcsFCODdigxfp325aq4z";

export default function Search() {
  const { username } = useContext(AuthContext);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [playlistData, setPlaylistData] = useState(null);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFetchPlaylist = async (e) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setPlaylistData(null);

    if (!playlistUrl.includes("soundcloud.com")) {
      setError("Please enter a valid SoundCloud playlist link.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.soundcloud.com/resolve?url=${encodeURIComponent(
          playlistUrl
        )}&client_id=${CLIENT_ID}`
      );

      const data = await res.json();
      console.log("🎧 Resolved data:", data);

      // Skip strict check — just warn if something seems off
      if (!data || !data.title) {
        console.warn("No metadata found — may be private or invalid.");
      }

      setPlaylistData(data);
    } catch (err) {
      console.error("Failed to resolve playlist:", err);
      setError("Could not load playlist. It may be private or invalid.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
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
                title
              }
            }
          `,
          variables: {
            url: playlistUrl,
            title: playlistData?.title || "SoundCloud Playlist",
          },
        }),
      });

      const result = await response.json();
      if (result.data?.savePlaylistToUser) {
        setSaved(true);
      } else {
        alert("Error saving playlist.");
      }
    } catch (err) {
      alert("You must be logged in to save playlists.");
    }
  };

  return (
    <div className="pt-24 px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        🎧 View a SoundCloud Playlist
      </h1>

      <form onSubmit={handleFetchPlaylist} className="flex gap-2 justify-center mb-10">
        <input
          type="text"
          placeholder="Paste a SoundCloud playlist link (with secret_token if private)"
          className="px-4 py-2 border border-gray-300 rounded-lg w-full"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Load
        </button>
      </form>

      {loading && <p className="text-center text-gray-500">Loading playlist...</p>}

      {error && <p className="text-center text-red-500 font-medium mb-4">{error}</p>}

      {playlistUrl && (
        <div className="bg-white shadow p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-2">
            {playlistData?.title || "Playlist"}
          </h2>

          <iframe
            title="SoundCloud Playlist"
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            className="rounded"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
              playlistUrl
            )}`}
          ></iframe>

          {username && !saved && (
            <button
              onClick={handleSave}
              className="mt-3 text-sm bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
            >
              Save to Profile
            </button>
          )}

          {saved && (
            <div className="mt-3 text-green-600 font-semibold">
              ✅ Playlist saved to your profile!
            </div>
          )}

          {playlistData?.tracks && (
            <ul className="mt-6 space-y-2">
              {playlistData.tracks.map((track, i) => (
                <li key={track.id} className="border-b pb-2">
                  <span className="font-medium">
                    {i + 1}. {track.title}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    — {track.user.username}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
