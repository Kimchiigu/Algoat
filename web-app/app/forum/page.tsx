"use client";

import NewForumDialog from "@/components/dialog-new-forum";
import Forum from "@/components/forum";
import GoBack from "@/components/go-back";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeProvider } from "next-themes";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";

export default function ForumPage() {
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
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="relative w-full min-h-screen">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
        />

        <div className="flex flex-col w-full min-h-screen relative">
          <GoBack href="/home"></GoBack>
          <div className="flex flex-row items-center justify-center mt-4">
            <Input
              className="w-1/2 bg-gray-600 p-6"
              placeholder="Search discussion"
            ></Input>
            <NewForumDialog></NewForumDialog>
          </div>
          <div
            className="h-[calc(100vh-10em)] mt-8 mx-8"
            style={{
              backdropFilter: "blur(16px)",
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.18)",
            }}
          >
            <ScrollArea className="h-full p-4">
              <Forum
                username="David"
                title="Cara Menjadi David"
                content="Berikut adalah cara menjadi David. Berikut adalah cara menjadi David. Berikut adalah cara menjadi David. Berikut adalah cara menjadi David. Berikut adalah cara menjadi David. Berikut adalah cara menjadi David. Berikut adalah cara menjadi David. Berikut adalah cara menjadi David. Berikut adalah cara menjadi David. Berikut adalah cara menjadi David. Berikut adalah cara menjadi David. Berikut adalah cara menjadi David."
                createdAt="07/27/2024"
              ></Forum>
            </ScrollArea>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
