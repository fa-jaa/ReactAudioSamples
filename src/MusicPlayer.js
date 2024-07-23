import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Star, Pause, Play } from 'lucide-react';

const MusicPlayer = ({ trackData }) => {
  // References to the waveform container and the WaveSurfer instance
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  // State variables to manage player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(null);

  // Initialize WaveSurfer when the component mounts or trackData changes
  useEffect(() => {
    let wavesurfer = null;

    const initializeWavesurfer = async () => {
      if (waveformRef.current && trackData.audioUrl) {
        // Destroy the previous instance if it exists
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }

        try {
          // Create a new WaveSurfer instance
          wavesurfer = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#D1D5DB',
            progressColor: '#F97316',
            cursorColor: '#F97316',
            barWidth: 4,
            barRadius: 3,
            responsive: true,
            height: 64,
            normalize: true,
            partialRender: true,
          });

          // Handle WaveSurfer events
          wavesurfer.on('ready', () => {
            console.log('Waveform is ready');
            setError(null);
            setDuration(wavesurfer.getDuration()); // Set the duration of the audio file
          });

          wavesurfer.on('error', (err) => {
            console.error('WaveSurfer error:', err);
            setError('Failed to load audio');
          });

          wavesurfer.on('play', () => setIsPlaying(true));
          wavesurfer.on('pause', () => setIsPlaying(false));

          await wavesurfer.load(trackData.audioUrl);
          wavesurferRef.current = wavesurfer;
        } catch (err) {
          console.error('Error initializing WaveSurfer:', err);
          setError('Failed to initialize audio player');
        }
      }
    };

    initializeWavesurfer();

    // Cleanup WaveSurfer instance when the component unmounts
    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, [trackData.audioUrl]);

  // Toggle play/pause state
  const handlePlayPause = () => {
    if (wavesurferRef.current && !error) {
      wavesurferRef.current.playPause();
    }
  };

  // Toggle starred state
  const handleStar = () => {
    setIsStarred(!isStarred);
  };

  // Helper function to format duration in minutes and seconds
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto shadow-sm">
      {/* Header with track label, star button, and play/pause button */}
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">Track</span>
        <div className="flex items-center space-x-2">
        <button onClick={handleStar} className="focus:outline-none">
            <Star className={`size={20} ${isStarred ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
          </button>
          <button 
            onClick={handlePlayPause}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white focus:outline-none ${error ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500'}`}
            disabled={error}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>
      
      {/* Track title and artist */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">{trackData.title}</h2>
        <p className="text-gray-500 text-sm mb-2">Artist: <span className="font-bold text-black">{trackData.artist}</span></p>
      </div>
  
      {/* Album cover and waveform */}
      <div className="flex mb-4">
        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 mr-4">
          <img src={trackData.albumArt} alt="Album Art" className="w-full h-full object-cover" />
        </div>
        <div className="flex-grow">
          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : (
            <div ref={waveformRef} className="h-16"></div>
          )}
        </div>
      </div>
  
      {/* Track details */}
      <div className="grid grid-cols-7 gap-4 text-xs">
        <div>
          <p className="text-gray-500">Length</p>
          <p>{duration ? formatDuration(duration) : 'Loading...'}</p>
        </div>
        <div>
          <p className="text-gray-500">Genre</p>
          <p>{trackData.genre}</p>
        </div>
        <div>
          <p className="text-gray-500">Added On</p>
          <p>{trackData.addedOn}</p>
        </div>
        <div>
          <p className="text-gray-500">Mood</p>
          <p>{trackData.mood}</p>
        </div>
        <div>
          <p className="text-gray-500">Instruments</p>
          <p>{trackData.instruments}</p>
        </div>
        <div>
          <p className="text-gray-500">Key</p>
          <p>{trackData.key}</p>
        </div>
        <div>
          <p className="text-gray-500">Tempo</p>
          <p>{trackData.tempo}</p>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;