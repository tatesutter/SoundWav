import React from 'react';

const Playlist = ({ playlistUrl }) => {
  return (
    <div className="playlist-container">
      <h2>SoundCloud Playlist</h2>
      <iframe
        width="100%"
        height="166"
        title="SoundWaves"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(playlistUrl)}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true`}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      ></iframe>
    </div>
  );
};

export default Playlist;
