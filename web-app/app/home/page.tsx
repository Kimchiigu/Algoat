"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";
import Typewriter from "typewriter-effect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
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
  };

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
          <div className="flex flex-col items-center w-1/2 space-y-4 text-2xl">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-1/2 p-10 text-3xl bg-gradient-to-r from-violet-200 to-pink-200 text-gray-800">
                  Play
                </Button>
              </DialogTrigger>
              <DialogContent>
                <Tabs defaultValue="account" className="w-full mt-7">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Create Room</TabsTrigger>
                    <TabsTrigger value="password">Join Room</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create Room</CardTitle>
                        <CardDescription>
                          Host a Room by creating a Room ID so your friends can
                          hop on!
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="name">Room Name</Label>
                          <Input id="name" placeholder="Input room name" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="username">Room ID</Label>
                          <Input id="username" placeholder="Input room ID" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="username">Room Password</Label>
                          <Input
                            id="username"
                            placeholder="Input room password"
                            type="password"
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Create Room</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="password">
                    <Card>
                      <CardHeader>
                        <CardTitle>Join Room</CardTitle>
                        <CardDescription>
                          Enter Room ID to Join the Room
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="current">Room ID</Label>
                          <Input
                            id="current"
                            type="text"
                            placeholder="Input room ID"
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Join Room</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
                {/* <DialogClose asChild>
                  <Button className="mt-4">Close</Button>
                </DialogClose> */}
              </DialogContent>
            </Dialog>
            <Button className="w-1/2 p-8 text-3xl bg-gradient-to-r from-violet-200 to-pink-200 text-gray-800">
              Learn
            </Button>
            <Button className="w-1/2 p-8 text-3xl bg-gradient-to-r from-violet-200 to-pink-200 text-gray-800">
              Forum
            </Button>
          </div>
          <div className="w-1/2 flex items-center justify-center relative">
            <img
              src="/logo_light.png"
              alt="Logo"
              className="relative z-10 w-1/2"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center w-full p-4 absolute bottom-0">
          <div className="flex row">
            <FontAwesomeIcon
              icon={faCog}
              size="2x"
              className="text-white ml-5"
            />
            <FontAwesomeIcon
              icon={faSignOutAlt}
              size="2x"
              className="text-red-600 ml-5"
            />
          </div>
          <p className="font-bold mr-5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            ©Algoat 2024
          </p>
        </div>
      </div>
    </div>
  );
}
