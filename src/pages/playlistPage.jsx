import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PlaylistPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query GetPlaylistById($id: ID!) {
            getPlaylistById(id: $id) {
              id
              url
              title
              sharedBy {
                username
              }
            }
          }
        `,
        variables: { id }
      })
    })
      .then(res => res.json())
      .then(data => setPlaylist(data.data?.getPlaylistById));
  }, [id]);

  if (!playlist) return <p className="pt-24 text-center">Loading playlist...</p>;

  return (
    <div className="pt-24 px-6 text-center space-y-4">
      <h1 className="text-2xl font-bold">{playlist.title}</h1>
      <p className="text-gray-500">Shared by: {playlist.sharedBy?.username || "Anonymous"}</p>
      <iframe
        title="Shared SoundCloud Player"
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        className="rounded-lg shadow"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(playlist.url)}`}
      ></iframe>
    </div>
  );
}
