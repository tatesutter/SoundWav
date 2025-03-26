import { useEffect, useState } from "react";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchFriends = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              query {
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
        setFriends(result.data?.getCurrentUser?.following || []);
      } catch (err) {
        console.error("Failed to load friends:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="pt-24 px-6 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">👥 Friends</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : friends.length === 0 ? (
        <p className="text-gray-500">You're not following anyone yet.</p>
      ) : (
        <ul className="space-y-2">
          {friends.map((user) => (
            <li key={user.username}>
              <a
                href={`/user/${user.username}`}
                className="text-blue-600 hover:underline"
              >
                @{user.username}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
