"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { fetchRoomData, leaveRoom } from "@/controller/room-controller";
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

interface RoomData {
  name: string;
  password: string;
  owner: string;
}

interface Player {
  userName: string;
  userId: string;
}

const RoomPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [topic, setTopic] = useState("Data Structure");
  const [numQuestions, setNumQuestions] = useState(10);
  const [answerTime, setAnswerTime] = useState(5);
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    if (currentUser) {
      setUser(currentUser);
    } else {
      console.log("User not authenticated");
      router.push("/");
      return;
    }

    const fetchData = async () => {
      // Fetch player list first
      let unsubscribePlayers: (() => void) | undefined;
      unsubscribePlayers = await fetchRoomData(
        id as string,
        async ({ playersList }) => {
          const isMember = playersList.some(
            (player) => player.userId === currentUser?.id
          );

          if (!isMember) {
            console.log("User is not a member of the room");
            router.push("/");
            return;
          }

          setPlayers(playersList);

          // Fetch room data
          let unsubscribeRoom: (() => void) | undefined;
          unsubscribeRoom = await fetchRoomData(
            id as string,
            ({ roomData }) => {
              setRoomData(roomData);
            }
          );

          return () => {
            if (unsubscribeRoom) unsubscribeRoom();
          };
        }
      );

      return () => {
        if (unsubscribePlayers) unsubscribePlayers();
      };
    };

    fetchData();
  }, [id, router]);

  const handleLeaveRoom = async () => {
    if (user && typeof id === "string") {
      await leaveRoom(id, user.uid);
      router.push("/");
    }
  };

  if (!roomData) return <div>Loading...</div>;

  return (
    <div className="flex w-full h-full p-4">
      {/* Participants Section */}
      <div className="w-1/4 p-4">
        <h2 className="text-xl font-bold">Participants</h2>
        <ul>
          {players.map((player, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span className="h-4 w-4 bg-gray-300 rounded-full"></span>
              <span>{player.userName}</span>
              {roomData.owner === player.userId && (
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
                  className="lucide lucide-crown"
                >
                  <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                  <path d="M5 21h14" />
                </svg>
              )}
            </li>
          ))}
        </ul>
        <Button className="mt-4" onClick={handleLeaveRoom}>
          Leave Room
        </Button>
      </div>

      {/* Room Settings Section */}
      <div className="w-1/2 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Choose Topic</CardTitle>
            <Select value={topic} onValueChange={(value) => setTopic(value)}>
              <SelectTrigger>
                <SelectValue>{topic}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Data Structure">Data Structure</SelectItem>
                <SelectItem value="Algorithms">Algorithms</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="numQuestions">Number of Questions</Label>
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
            <div className="space-y-1">
              <Label htmlFor="answerTime">Answer Time (in minutes)</Label>
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
            <Button className="mt-4">Start</Button>
          </CardContent>
        </Card>
      </div>

      {/* Chat Section */}
      <div className="w-1/4 p-4">
        <h2 className="text-xl font-bold">Room ID: {id}</h2>
        <div className="space-y-2">
          {players.map((player, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="h-4 w-4 bg-gray-300 rounded-full"></span>
              <span>{player.userName}</span>
            </div>
          ))}
        </div>
        <Button className="mt-4">Open Chat with Sheet</Button>
      </div>
    </div>
  );
};

export default RoomPage;
