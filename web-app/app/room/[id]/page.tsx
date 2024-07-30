"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { fetchRoomData, leaveRoom } from "@/controller/room-controller";
import { Button } from "@/components/ui/button";

interface RoomData {
  name: string;
  password: string;
}

interface Player {
  userName: string;
}

const RoomPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [user, setUser] = useState<any | null>(null); // Adjust type according to your user model

  useEffect(() => {
    const fetchUserData = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
      } else {
        console.log("User not authenticated");
        router.push("/");
      }
    };

    const fetchRoomInfo = async () => {
      if (typeof id === "string") {
        const data = await fetchRoomData(id);
        if (data) {
          setRoomData(data.roomData);
          setPlayers(data.playersList);
        } else {
          router.push("/");
        }
      }
    };

    fetchUserData();
    fetchRoomInfo();
  }, [id, router]);

  const handleLeaveRoom = async () => {
    if (user && typeof id === "string") {
      await leaveRoom(id, user.uid);
      router.push("/");
    }
  };

  if (!roomData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Room: {roomData.name}</h1>
      <h2>Players:</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player.userName}</li>
        ))}
      </ul>
      <Button onClick={handleLeaveRoom}>Leave Room</Button>
    </div>
  );
};

export default RoomPage;
