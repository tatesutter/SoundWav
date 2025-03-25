import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Link, useLocation } from "react-router-dom";

export default function Profile() {
  const { username } = useContext(AuthContext);
  const location = useLocation();
  const [playlists, setPlaylists] = useState([]);
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState("playlists");
  const [unsavedPlaylistId, setUnsavedPlaylistId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query {
              getUserPlaylists {
                id
                url
                title
              }
              getCurrentUser {
                following {
                  username
                }
              }
            }
          `,
        }),
      });

      const result = await res.json();
      setPlaylists(result.data?.getUserPlaylists || []);
      setFriends(result.data?.getCurrentUser?.following || []);
    };

    fetchData();
  }, []);

  const handleUnsave = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation UnsavePlaylist($id: ID!) {
              unsavePlaylistFromUser(id: $id) {
                message
              }
            }
          `,
          variables: { id },
        }),
      });

      setPlaylists((prev) => prev.filter((pl) => pl.id !== id));
      setUnsavedPlaylistId(id);
      setTimeout(() => setUnsavedPlaylistId(null), 3000);
    } catch (err) {
      console.error("Error unsaving playlist:", err);
    }
  };

  return (
    <div className="pt-24 px-6 text-center">
      <h1 className="text-3xl font-bold mb-2">👤 Profile</h1>
      <p className="text-lg text-gray-700 mb-6">
        Logged in as: <strong>{username}</strong>
      </p>

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("playlists")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeTab === "playlists"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          🎵 Playlists
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeTab === "friends"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          👥 Friends
        </button>
      </div>

      {activeTab === "playlists" ? (
        playlists.length === 0 ? (
          <p className="text-gray-500">You haven't saved any playlists yet.</p>
        ) : (
          <div className="grid gap-6 max-w-3xl mx-auto">
            {playlists.map((pl) => (
              <div key={pl.id} className="bg-white p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-2">{pl.title || "Untitled Playlist"}</h2>

                <iframe
                  title={`Playlist ${pl.id}`}
                  width="100%"
                  height="166"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(pl.url)}`}
                  className="rounded-md"
                ></iframe>

                <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <a
                    href={`/playlist/${pl.id}`}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Share this playlist →
                  </a>

                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleUnsave(pl.id)}
                      className="text-sm text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-100 transition"
                    >
                      Unsave
                    </button>
                    {unsavedPlaylistId === pl.id && (
                      <span className="text-green-600 text-sm font-medium">
                        ✅ Playlist removed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div>
          {friends.length === 0 ? (
            <p className="text-gray-500">You're not following anyone yet.</p>
          ) : (
            <ul className="space-y-2">
              {friends.map((friend) => (
                <li key={friend.username}>
                  <a
                    href={`/user/${friend.username}`}
                    className="text-blue-600 hover:underline"
                  >
                    @{friend.username}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
