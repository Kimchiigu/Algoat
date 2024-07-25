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
import { ThemeProvider } from "next-themes";

export default function PlayDialog() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
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
                    Host a Room by creating a Room ID so your friends can hop
                    on!
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
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
