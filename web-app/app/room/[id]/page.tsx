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
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    // Fetch user data and ensure they are authenticated
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      console.log("User not authenticated");
      router.push("/");
      return;
    }

    let unsubscribe: (() => void) | undefined;

    // Fetch room data and set up listeners
    const fetchData = async () => {
      unsubscribe = await fetchRoomData(
        id as string,
        ({ roomData, playersList }) => {
          setRoomData(roomData);
          setPlayers(playersList);
        }
      );
    };

    fetchData();

    // Cleanup on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
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
