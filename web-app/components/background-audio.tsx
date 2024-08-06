"use client";

import { useEffect, useRef } from "react";
import { useVolume } from "@/lib/VolumeContext";

const BackgroundAudio = () => {
  const { volume } = useVolume();
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
