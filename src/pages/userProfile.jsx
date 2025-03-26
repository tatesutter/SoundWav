import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function UserProfile() {
  const { username } = useParams();
  const { username: loggedInUsername } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedPlaylistId, setSavedPlaylistId] = useState(null);
  const [savedUrls, setSavedUrls] = useState(new Set());

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(import.meta.env.VITE_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            query: `
              query GetUserProfile($username: String!) {
                getUserProfile(username: $username) {
                  id
                  username
                  followers { id }
                  savedPlaylists {
                    id
                    url
                    title
                  }
                }
              }
            `,
            variables: { username },
          }),
        });

        const data = await res.json();
        const fetchedUser = data.data?.getUserProfile;
        setUser(fetchedUser);

        const isFollowing = fetchedUser?.followers?.some(
          (f) => f.id === JSON.parse(atob(token.split(".")[1])).userId
        );
        setFollowing(isFollowing);
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedPlaylists = async () => {
      try {
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
                  url
                }
              }
            `,
          }),
        });

        const data = await res.json();
        const urls = data.data?.getUserPlaylists?.map((pl) => pl.url);
        if (urls) setSavedUrls(new Set(urls));
      } catch (err) {
        console.error("Error fetching current user's playlists:", err);
      }
    };

    if (username && token) {
      fetchUserProfile();
      fetchSavedPlaylists();
    }
  }, [username, token]);

  const handleFollow = async (action) => {
    try {
      const mutation = action === "follow" ? "followUser" : "unfollowUser";

      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation FollowAction($targetUsername: String!) {
              ${mutation}(targetUsername: $targetUsername) {
                username
              }
            }
          `,
          variables: { targetUsername: user.username },
        }),
      });

      const result = await res.json();
      if (result.data) {
        setFollowing(action === "follow");
      }
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  const handleSave = async (url, title, playlistId) => {
    try {
      const res = await fetch("http://localhost:4000/graphql", {
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
              }
            }
          `,
          variables: { url, title },
        }),
      });

      const result = await res.json();
      if (result.data?.savePlaylistToUser) {
        setSavedUrls((prev) => new Set(prev).add(url));
        setSavedPlaylistId(playlistId);
        setTimeout(() => setSavedPlaylistId(null), 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  if (loading) return <p className="pt-24 text-center text-gray-500">Loading...</p>;
  if (!user) return <p className="pt-24 text-center text-red-500">User not found.</p>;

  return (
    <div className="pt-24 px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">👤 {user.username}'s Profile</h1>

      {loggedInUsername && user.username !== loggedInUsername && (
        <button
          onClick={() => handleFollow(following ? "unfollow" : "follow")}
          className={`mt-2 mb-6 text-sm px-4 py-2 rounded ${
            following
              ? "bg-red-100 text-red-500 border border-red-300 hover:bg-red-200"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {following ? "Unfollow" : "Follow"}
        </button>
      )}

      {user.savedPlaylists.length === 0 ? (
        <p className="text-gray-500">No playlists saved yet.</p>
      ) : (
        <div className="space-y-4">
          {user.savedPlaylists.map((pl) => {
            const alreadySaved = savedUrls.has(pl.url);
            return (
              <div key={pl.id} className="bg-white shadow p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">
                  {pl.title || "Untitled Playlist"}
                </h2>
                <iframe
                  title={pl.id}
                  width="100%"
                  height="166"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(pl.url)}`}
                  className="rounded"
                ></iframe>

                {loggedInUsername && loggedInUsername !== user.username && (
                  <>
                    <button
                      onClick={() => handleSave(pl.url, pl.title, pl.id)}
                      disabled={alreadySaved}
                      className={`mt-2 text-sm px-4 py-1 rounded transition ${
                        alreadySaved
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {alreadySaved ? "Saved" : "Save to My Profile"}
                    </button>
                    {savedPlaylistId === pl.id && (
                      <div className="mt-2 text-green-600 font-medium text-sm">
                        ✅ Playlist saved to your profile!
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
