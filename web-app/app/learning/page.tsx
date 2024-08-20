"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useCallback, useState } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";
import Link from "next/link";
import GoBack from "@/components/go-back";
import { createRoom, joinRoom } from "@/controller/room-controller";
import useUserStore from "@/lib/user-store";
import withAuth from "@/hoc/withAuth";

interface HoverCardProps {
  imageSrc: string;
  title: string;
  description: string;
}

function LearningPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const { currentUser } = useUserStore();
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadStarsPreset(engine);
  }, []);

  const particlesOptions = {
    preset: "stars",
    background: {
      color: {
        value: "#000",
      },
    },
    particles: {
      move: {
        speed: 1,
      },
    },
  };

  const generateRandom = () => {
    let min = 1000000000;
    let max = 9999999999;
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  };

  const handleCreateRoom = async () => {
    try {
      setPassword(generateRandom().toString());
      const roomId = await createRoom(
        currentUser?.username,
        password,
        currentUser?.id
      );
      handleJoinRoom(roomId.toString(), true);
    } catch (error) {
      console.error("Error creating room: ", error);
    }
  };

  const handleJoinRoom = async (
    roomId: string,
    isCreating: boolean = false
  ) => {
    if (currentUser) {
      const room = await joinRoom(
        roomId,
        password,
        currentUser.id,
        currentUser.username,
        isCreating
      );
      if (room) {
        router.push(`/learning/practice/${room}`);
      } else {
        console.log("Room not found or incorrect password");
      }
    } else {
      console.log("User not authenticated");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />
      <div className="flex flex-col items-center min-h-screen justify-center mx-10">
        <GoBack href="/home" />
        <h2 className="scroll-m-20 border-b mb-2 pb-2 text-5xl font-semibold tracking-tight first:mt-0 z-[999]">
          Welcome to AlgoatCamp!
        </h2>
        <p className="mb-4 text-white z-[999]">
          This is the training camp for you who wants to be stronger
        </p>
        <div className="flex flex-row justify-around w-full mt-4 gap-5">
          <Link href={""} className="w-full" onClick={handleCreateRoom}>
            <HoverCard
              imageSrc="/learning/practice.png"
              title="Practice"
              description="Sharpen your skills with practice problems."
            />
          </Link>
          <Link href={"/learning/material"} className="w-full">
            <HoverCard
              imageSrc="/learning/material.png"
              title="Material"
              description="Learn from a variety of materials available."
            />
          </Link>
          <Link href={"/learning/ranking"} className="w-full">
            <HoverCard
              imageSrc="/learning/ranking.png"
              title="Ranking"
              description="Track your progress and see how you rank."
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

function HoverCard({ imageSrc, title, description }: HoverCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      className="relative flex flex-col items-center rounded-xl shadow-md w-full cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={imageSrc}
        alt={title}
        width={500}
        height={100}
        className={`transition-all duration-300 ${
          hovered
            ? "blur-sm"
            : "transition-transform duration-300 ease-in-out rounded-xl z-0"
        }`}
      />
      <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex flex-col items-center justify-center bg-black/20 rounded-xl">
        <h2 className="text-white font-bold text-5xl z-20 mb-3">{title}</h2>
        <p
          className={`text-white text-lg z-20 transition-all duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {description}
        </p>
      </div>
    </Card>
  );
}

export default withAuth(LearningPage, true);
