import { useState } from "react";
import { Link } from "react-router-dom";

export default function SearchUsers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query SearchUsers($username: String!) {
              searchUsers(username: $username) {
                id
                username
              }
            }
          `,
          variables: { username: query },
        }),
      });

      const data = await res.json();
      setResults(data.data?.searchUsers || []);
    } catch (err) {
      console.error("User search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 px-6 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">🔍 Search for Users</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Enter username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-gray-500">Searching...</p>}

      {results.length > 0 && (
        <ul className="space-y-4">
          {results.map((user) => (
            <li key={user.id} className="bg-white shadow p-4 rounded-lg">
              <div className="font-semibold text-lg">{user.username}</div>
              <Link
                to={`/user/${user.username}`}
                className="text-sm text-blue-600 hover:underline"
              >
                View Profile →
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!loading && results.length === 0 && query && (
        <p className="text-gray-500">No users found for "{query}".</p>
      )}
    </div>
  );
}
