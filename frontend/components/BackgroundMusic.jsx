import React, { useEffect, useRef } from "react";

const BackgroundMusic = ({
  // Using an online sample track from SoundHelix
  src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  volume = 0.5,
  playOnStart = true,
}) => {
  const audioRef = useRef(null);

  // Play the music on component mount if playOnStart is true
  useEffect(() => {
    if (playOnStart && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Background music play error:", error);
        });
      }
    }
  }, [playOnStart]);

  // Update the audio element's volume whenever it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return <audio ref={audioRef} src={src} loop />;
};

export default BackgroundMusic;
