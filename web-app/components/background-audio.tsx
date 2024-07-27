"use client";

// components/BackgroundAudio.js
import { useEffect, useRef } from "react";

const BackgroundAudio = ({ volume }: { volume: number }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
  }, []);

  return (
    <audio ref={audioRef} loop>
      <source src="algoat-bgm.m4a" type="audio/mp4" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default BackgroundAudio;
