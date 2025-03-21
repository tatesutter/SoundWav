import React from 'react';
import Playlist from './Playlist';

const App = () => {

//const playlistUrl = "https://api.soundcloud.com/tracks/256246110"; // Say It So by Weezer that is Hard Coded
//const playlistUrl = "https://api.soundcloud.com/tracks/252514617"; // Killer Queen by Queen that is Hard Code
const playlistUrl = "https://api.soundcloud.com/playlists/1988001584?secret_token=s-geYoOFOmTJL"; //Hard coded playlist for https://soundcloud.com/daniel-farmer3/sets/friends-playlist
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to SoundCloud Playlist Viewer</h1>
        <Playlist playlistUrl={playlistUrl} />
      </header>
    </div>
  );
};

export default App;
