import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [previousMinute, setPreviousMinute] = useState(0);
  const [gongReady, setGongReady] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const timerRef = useRef(null);
  const gongSoundRef = useRef(null);
  const silentAudioRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState('#fafafa');

  // Effect for updating the timer every second
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current); // Cleanup
  }, [isRunning]);

  useEffect(() => {
    const minutes = Math.floor(seconds / 60);
    if (minutes > previousMinute) {
      playGong(); // Play gong when minute increases
      setPreviousMinute(minutes);
    }
  }, [seconds, previousMinute]);

  // Function to unlock the audio context on iOS using the silent audio clip
  const unlockAudioContext = () => {
    if (!audioUnlocked) {
      silentAudioRef.current.play().then(() => {
        setAudioUnlocked(true); // Unlock audio context on iOS
        setGongReady(true); // Now gong sound can play
        playGong(); // Play gong when timer starts
      }).catch((error) => console.log('Silent audio playback failed:', error));
    } else {
      setGongReady(true); // Gong can play after unlocking
      playGong(); // Play gong when timer starts
    }
  };

  const playGong = () => {
    if (gongReady && audioUnlocked) {
      gongSoundRef.current.currentTime = 0;
      gongSoundRef.current.play().catch((error) => console.log('Gong playback failed:', error));
    }
  };

  // Function to handle starting the timer
  const startTimer = () => {
    setBackgroundColor('#a6d854'); // Pastel blue for running
    unlockAudioContext();
    setIsRunning(true);
  };

  // Function to handle stopping the timer
  const stopTimer = () => {
    setIsRunning(false);
    setBackgroundColor('#ffd92f'); // Pastel yellow for paused
    playGong(); // Play gong when pausing
  };

  // Function to handle resetting the timer
  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
    setPreviousMinute(0);
    setBackgroundColor('#fafafa'); // Pastel green for idle
  };

  return (
    <div className="timer-container" style={{ backgroundColor }} 
      onClick={() => (isRunning ? stopTimer() : startTimer())} 
      onDoubleClick={resetTimer}>
      <h1>{`${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`}</h1>

      {/* Silent audio for iOS audio context unlock */}
      <audio ref={silentAudioRef} src="/silent.mp3" preload="auto"></audio>

      {/* Gong sound */}
      <audio ref={gongSoundRef} src="/gong.mp3" preload="auto"></audio>
    </div>
  );
}

export default App;
