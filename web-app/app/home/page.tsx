"use client";

import { useCallback, useEffect } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";
import Typewriter from "typewriter-effect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import PlayDialog from "../../components/dialog-play";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { useUserStore } from "@/lib/userStore";
import withAuth from "@/hoc/withAuth";
import { handleLogout } from "@/controller/user-controller";
import Link from "next/link";

function HomePage() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  const greetings = [
    "Hello!",
    "Hola!",
    "Bonjour!",
    "Hallo!",
    "Ciao!",
    "こんにちは!",
    "안녕하세요!",
    "您好!",
    "Olá!",
    "Привет!",
  ];

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

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user.uid);
      }
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) {
    return (
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />
    );
  }

  return (
    <div className="relative w-full min-h-screen">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />

      {/* Content */}
      <div className="flex flex-col items-center justify-center w-full min-h-screen relative z-10">
        {/* Navbar */}
        <div className="flex justify-end items-center w-full p-4 absolute top-0 py-5">
          <div className="flex items-center text-2xl font-bold mr-5 text-white">
            <Typewriter
              options={{
                strings: greetings,
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50,
              }}
            />
            <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Algoaters
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-row items-center justify-center w-full h-full">
          <div className="flex flex-col items-center w-1/2 gap-8 text-2xl">
            <PlayDialog></PlayDialog>
            <Link
              href="/learning"
              className="w-full flex flex-row items-center justify-center"
            >
              <Button className="w-1/3 py-10 text-5xl bg-gradient-to-r from-violet-200 to-pink-200 text-gray-800 transform transition-transform duration-300 ease-in-out hover:scale-125 font-consolas">
                Learn
              </Button>
            </Link>
            <Link
              href="/forum"
              className="w-full flex flex-row items-center justify-center"
            >
              <Button className="w-1/3 py-10 text-5xl bg-gradient-to-r from-violet-200 to-pink-200 text-gray-800 transform transition-transform duration-300 ease-in-out hover:scale-125 font-consolas">
                Forum
              </Button>
            </Link>
          </div>
          <div className="w-1/2 flex items-center justify-center relative">
            <img
              src="/logo_light.png"
              alt="Logo"
              className="relative z-10 w-3/4"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center w-full p-4 absolute bottom-0">
          <div className="flex row justify-center items-center">
            <Button variant="ghost" className="p-8">
              <FontAwesomeIcon icon={faCog} size="2x" className="text-white" />
            </Button>

            <Button onClick={handleLogout} variant="ghost" className="p-8">
              <FontAwesomeIcon
                icon={faSignOutAlt}
                size="2x"
                className="text-red-600"
              />
            </Button>
          </div>
          <p className="font-bold mr-5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            ©Algoat 2024
          </p>
        </div>
      </div>
    </div>
  );
}

export default withAuth(HomePage, true);
