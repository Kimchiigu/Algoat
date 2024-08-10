"use client";

import { useRouter, useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createRoom,
  joinRoom,
  sendMessage,
  handleRoomLifecycle,
  leaveRoom,
  updateRoomSettings,
  startPlaying,
} from "@/controller/room-controller";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useUserStore from "@/lib/user-store";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase";
import GoBack from "@/components/go-back";

interface RoomData {
  name: string;
  password: string;
  ownerId: string;
  topic: string;
  numQuestions: number;
  answerTime: number;
  isPlay?: boolean;
}

interface Player {
  userName: string;
  userId: string;
}

const tips = [
  "Break problems into smaller pieces.",
  "Practice coding every day.",
  "Read code written by others.",
  "Work on real projects.",
  "Learn to use version control systems.",
  "Understand algorithms and data structures.",
  "Participate in coding challenges.",
  "Write clean and readable code.",
  "Debug your code regularly.",
  "Keep up with new technologies.",
  "Document your code.",
  "Use meaningful variable names.",
  "Optimize your code for performance.",
  "Collaborate with other developers.",
  "Test your code thoroughly.",
  "Learn multiple programming languages.",
  "Stay curious and keep learning.",
  "Read programming books and blogs.",
  "Follow best practices and coding standards.",
  "Build a portfolio of your projects.",
];

export default function PracticePage() {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const { currentUser } = useUserStore();
  const router = useRouter();
  const { id } = useParams();
  const [topic, setTopic] = useState("Algorithm and Data Structure");
  const [numQuestions, setNumQuestions] = useState(10);
  const [answerTime, setAnswerTime] = useState(5);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadStarsPreset(engine);
  }, []);

  useEffect(() => {
    handleRoomLifecycle(
      id as string,
      currentUser,
      setRoomData,
      setPlayers,
      setMessages,
      setTopic,
      setNumQuestions,
      setAnswerTime,
      router
    );

    const roomDocRef = doc(db, "Rooms", id as string);
    const unsubscribe = onSnapshot(roomDocRef, (doc) => {
      const data = doc.data();
      if (data?.isPlay) {
        router.push(`/room/${id}/play`);
      }
    });

    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 10000); // 10 seconds

    return () => {
      unsubscribe();
      clearInterval(tipInterval);
    };
  }, [id, router, currentUser]);

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

  const handleUpdateSettings = async () => {
    try {
      await updateRoomSettings(id as string, {
        topic,
        numQuestions,
        answerTime,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartPlaying = async () => {
    try {
      await startPlaying(id as string);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      <GoBack href="/learning"></GoBack>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />
      <div className="flex flex-col w-full min-h-screen relative justify-center items-center">
        <div className="flex flex-col justify-between z-50 p-4 bg-gray-400/20 backdrop-blur-sm rounded-lg shadow-md w-1/2 border-r border-border">
          <Card className="bg-gray-700/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-primary mb-5">Room Settings</CardTitle>
              <Select value={topic} onValueChange={(value) => setTopic(value)}>
                <SelectTrigger>
                  <SelectValue>{topic}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Algorithm and Data Structure">
                    Algorithm and Data Structure
                  </SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                  <SelectItem value="Design Pattern">Design Pattern</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="numQuestions" className="text-primary">
                  Number of Questions
                </Label>
                <Select
                  value={numQuestions.toString()}
                  onValueChange={(value) => setNumQuestions(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue>{numQuestions}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="answerTime" className="text-primary">
                  Answer Time (in minutes)
                </Label>
                <Select
                  value={answerTime.toString()}
                  onValueChange={(value) => setAnswerTime(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue>{answerTime}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((time) => (
                      <SelectItem key={time} value={time.toString()}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  className="bg-primary text-primary-foreground"
                  onClick={() => handleUpdateSettings()}
                >
                  Update Settings
                </Button>
                <Button
                  className="bg-primary text-primary-foreground"
                  onClick={() => handleStartPlaying()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-play mr-2"
                  >
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                  Start
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
