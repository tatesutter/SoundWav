import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";

export default function Profile() {
  const { username } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:4000/graphql", {
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
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((data) => setPlaylists(data.data?.getUserPlaylists || []))
      .catch((err) => console.error("Error fetching playlists:", err));
  }, []);

  const handleUnsave = async (id) => {
    const token = localStorage.getItem("token");
    const confirmed = window.confirm("Remove this playlist from your profile?");
    if (!confirmed) return;

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

      // Update state to remove the playlist from UI
      setPlaylists((prev) => prev.filter((pl) => pl.id !== id));
    } catch (err) {
      console.error("Error unsaving playlist:", err);
    }
  };

  return (
    <div className="pt-24 px-6 text-center">
      <h1 className="text-3xl font-bold mb-2">👤 Profile</h1>
      <p className="text-lg text-gray-700 mb-8">
        Logged in as: <strong>{username}</strong>
      </p>

      {playlists.length === 0 ? (
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

                <button
                  onClick={() => handleUnsave(pl.id)}
                  className="text-sm text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-100 transition"
                >
                  Unsave
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
