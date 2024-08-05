"use client";

import { useRouter, useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  createRoom,
  joinRoom,
  sendMessage,
  handleRoomLifecycle,
  leaveRoom,
  updateRoomSettings,
  startPlaying,
} from "@/controller/room-controller";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUserStore from "@/lib/user-store";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";
import Particles from "react-tsparticles";

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

const particlesInit = async (engine: Engine) => {
  await loadStarsPreset(engine);
};

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

const RoomPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [topic, setTopic] = useState("Algorithm and Data Structure");
  const [numQuestions, setNumQuestions] = useState(10);
  const [answerTime, setAnswerTime] = useState(5);
  const { currentUser } = useUserStore();

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

    // Real-time listener for isPlay
    const roomDocRef = doc(db, "Rooms", id as string);
    const unsubscribe = onSnapshot(roomDocRef, (doc) => {
      const data = doc.data();
      if (data?.isPlay) {
        router.push(`/room/${id}/play`);
      }
    });

    return () => unsubscribe();
  }, [id, router, currentUser]);

  const handleLeaveRoom = async () => {
    if (user && typeof id === "string") {
      await leaveRoom(id, user.uid);
      router.push("/");
    }
  };

  const handleSendMessage = async () => {
    if (currentUser && messageInput.trim() !== "") {
      await sendMessage(id as string, currentUser.id, messageInput);
      setMessageInput("");
    }
  };

  const handleUpdateSettings = async () => {
    if (roomData && currentUser && currentUser.id === roomData.ownerId) {
      await updateRoomSettings(id as string, {
        topic,
        numQuestions,
        answerTime,
      });
    }
  };

  const handleStartPlaying = async () => {
    if (roomData && currentUser && currentUser.id === roomData.ownerId) {
      await startPlaying(id as string);
    }
  };

  if (!roomData) return <div>Loading...</div>;

  const isOwner = currentUser && currentUser.id === roomData.ownerId;

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />
      <div className="flex w-full p-4 space-x-6 bg-gradient text-foreground h-screen">
        {/* Participants Section */}
        <div className="flex flex-col justify-between p-4 bg-gray-400/20 backdrop-blur-sm rounded-lg shadow-md w-1/4">
          <div>
            <h2 className="text-xl font-bold mb-2">Participants</h2>
            <ul className="space-y-2 mt-5 flex flex-col justify-start">
              {players
                .filter((player) => player.userId === roomData.ownerId)
                .concat(
                  players
                    .filter((player) => player.userId !== roomData.ownerId)
                    .sort((a, b) => a.userName.localeCompare(b.userName))
                )
                .map((player, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span
                      className={`h-4 w-4 rounded-full ${
                        roomData.ownerId === player.userId
                          ? "bg-yellow-300"
                          : "bg-gray-300"
                      }`}
                    ></span>
                    <span>{player.userName}</span>
                    {roomData.ownerId === player.userId && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-crown text-primary"
                      >
                        <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                        <path d="M5 21h14" />
                      </svg>
                    )}
                  </li>
                ))}
            </ul>
          </div>
          <Button
            className="mt-5 bg-red-600 hover:bg-red-700 text-destructive-foreground"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </Button>
        </div>

        {/* Room Settings Section */}
        <div className="flex flex-col z-50 p-4 bg-gray-400/20 backdrop-blur-sm rounded-lg shadow-md w-1/2 border-r border-border">
          <Card className="bg-gray-700/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-primary mb-5">Room Settings</CardTitle>
              {isOwner ? (
                <Select
                  value={topic}
                  onValueChange={(value) => setTopic(value)}
                >
                  <SelectTrigger>
                    <SelectValue>{topic}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Algorithm and Data Structure">
                      Algorithm and Data Structure
                    </SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="Design Pattern">
                      Design Pattern
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p>{roomData.topic}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="numQuestions" className="text-primary">
                  Number of Questions
                </Label>
                {isOwner ? (
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
                ) : (
                  <p>{roomData.numQuestions}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="answerTime" className="text-primary">
                  Answer Time (in minutes)
                </Label>
                {isOwner ? (
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
                ) : (
                  <p>{roomData.answerTime}</p>
                )}
              </div>
              <div className="flex gap-3 justify-center">
                {isOwner && (
                  <Button
                    className="bg-primary text-primary-foreground"
                    onClick={handleUpdateSettings}
                  >
                    Update Settings
                  </Button>
                )}
                {isOwner && (
                  <Button
                    className="bg-primary text-primary-foreground"
                    onClick={handleStartPlaying}
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
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Section */}
        <div className="flex flex-col p-4 bg-gray-400/20 backdrop-blur-sm rounded-lg shadow-lg w-1/4 flex-grow">
          <h2 className="text-xl font-bold mb-2">Room ID: {id}</h2>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto mb-4 space-y-2 bg-gray-700/20 backdrop-blur-sm p-2 rounded-md border border-border">
              {messages.map((message, index) => (
                <div key={index} className="mb-2">
                  <strong>{message.userName}</strong>: {message.message}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                id="messageInput"
                placeholder="Type your message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 bg-gray-700/20 backdrop-blur-sm"
              />
              <Button
                className="bg-primary text-primary-foreground"
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomPage;
