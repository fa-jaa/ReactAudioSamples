import React from 'react';
import MusicPlayer from './MusicPlayer';

const App = () => {
  const trackData = {
    title: "Starry Dreams",
    artist: "Luna Melody",
    audioUrl: process.env.PUBLIC_URL + '/music.mp3',
    albumArt: process.env.PUBLIC_URL + '/albumCover1.jpeg',
    length: "3:45",
    genre: "Ethereal Ambient",
    addedOn: "20 Jan 2024",
    mood: "Soothing, Dreamy",
    instruments: "Piano, Synthesiser, Violin",
    key: "A Minor",
    tempo: "60 BPM"
  };

  return (
    <div className="App bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <MusicPlayer trackData={trackData} />
    </div>
  );
};

export default App;