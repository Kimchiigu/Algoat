import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/firebase";
import { createRoom, joinRoom } from "@/controller/room-controller";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import useUserStore from "@/lib/user-store";

export default function PlayDialog() {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [joinRoomPassword, setJoinRoomPassword] = useState("");
  const [userName, setUserName] = useState("");

  const router = useRouter();
  const { currentUser } = useUserStore();

  const handleCreateRoom = async () => {
    const user = auth.currentUser;
    if (userName.trim() === "") {
      console.log("User name is required");
      return;
    }
    if (user) {
      try {
        const roomId = await createRoom(roomName, roomPassword, user.uid);
        handleJoinRoom(roomId.toString(), true);
      } catch (e) {
        console.error("Error creating room: ", e);
      }
    } else {
      console.log("User not authenticated");
    }
  };

  const handleJoinRoom = async (
    roomId: string,
    isCreating: boolean = false
  ) => {
    if (currentUser) {
      const room = await joinRoom(
        roomId,
        joinRoomPassword,
        currentUser.id,
        userName,
        isCreating
      );
      if (room) {
        router.push(`/room/${room}`);
      } else {
        console.log("Room not found or incorrect password");
      }
    } else {
      console.log("User not authenticated");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-1/3 py-10 text-5xl bg-gradient-to-r from-violet-200 to-pink-200 text-gray-800 transform transition-transform duration-300 ease-in-out hover:scale-125 font-consolas">
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
                  Host a Room by creating a Room ID so your friends can hop on!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Room Name</Label>
                  <Input
                    id="name"
                    placeholder="Input room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Room Password</Label>
                  <Input
                    id="password"
                    placeholder="Input room password"
                    type="password"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Your Name</Label>
                  <Input
                    id="username"
                    placeholder="Input your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCreateRoom}>Create Room</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Join Room</CardTitle>
                <CardDescription>
                  Enter Room ID and Password to Join the Room
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="joinId">Room ID</Label>
                  <Input
                    id="joinId"
                    type="text"
                    placeholder="Input room ID"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="joinPassword">Room Password</Label>
                  <Input
                    id="joinPassword"
                    type="password"
                    placeholder="Input room password"
                    value={joinRoomPassword}
                    onChange={(e) => setJoinRoomPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Your Name</Label>
                  <Input
                    id="username"
                    placeholder="Input your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleJoinRoom(joinRoomId, false)}>
                  Join Room
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
