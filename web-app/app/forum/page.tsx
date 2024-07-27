"use client";

import NewForumDialog from "@/components/dialog-new-forum";
import Forum from "@/components/forum";
import GoBack from "@/components/go-back";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeProvider } from "next-themes";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";
import { useForumsAndUsers } from "@/hooks/forums-hooks";
import { Button } from "@/components/ui/button";

export default function ForumPage() {
  const { forums, users } = useForumsAndUsers();

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
              className="w-1/2 p-6 bg-gray-700 text-white placeholder-gray-400 rounded-lg shadow-lg"
              placeholder="Search discussion"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(16px)",
              }}
            />
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
            <ScrollArea className="h-full p-8 flex flex-col">
              {forums.map((forum) => (
                <div className="border rounded-lg mb-8">
                  <Forum
                    key={forum.id}
                    username={users[forum.senderId] || "Unknown"}
                    title={forum.title}
                    content={forum.contents}
                    createdAt={forum.createdAt}
                    file={forum.file}
                    fileName={forum.fileName}
                    fileType={forum.fileType}
                  />
                  <Button className="ml-8 mb-8">See more</Button>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
