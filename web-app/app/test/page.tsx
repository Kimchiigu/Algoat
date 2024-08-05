// "use client";
// import { useCallback, useEffect, useState } from "react";
// import router, { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import axios from "@/lib/axiosConfig";
// import { db } from "@/firebase";
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   onSnapshot,
//   collection,
//   getDocs,
// } from "firebase/firestore";
// import { useParams } from "next/navigation";
// import { fetchRoomData } from "@/controller/room-controller";
// import useUserStore from "@/lib/user-store";
// import type { Engine } from "tsparticles-engine";
// import { loadStarsPreset } from "tsparticles-preset-stars";
// import { useForumsAndUsers } from "@/hooks/forums-hooks";
// import Particles from "react-tsparticles";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// interface QuestionResponse {
//   question: string;
//   phaseTime: any;
// }

// interface Answer {
//   player: string;
//   answer: string;
// }

// interface ScoreResponse {
//   player: string;
//   score: number;
// }

// interface JudgementResponse {
//   question: string;
//   answers: ScoreResponse[];
//   winner: string;
// }

// interface RoomData {
//   name: string;
//   password: string;
//   ownerId: string;
//   topic: string;
//   numQuestions: number;
//   answerTime: number;
// }

// interface Player {
//   userName: string;
//   userId: string;
// }

// interface LeaderboardResponse {
//   leaderboard: { player: string; score: number }[];
// }

// const PlayPage = () => {
//   const leaderboard = [
//     { player: "Alice", score: 150 },
//     { player: "Bob", score: 200 },
//     { player: "Charlie", score: 180 },
//     { player: "Diana", score: 220 },
//     { player: "Eve", score: 175 },
//   ];

//   const [phase, setPhase] = useState<
//     "question" | "answer" | "judging" | "ended" | "leaderboard"
//   >("ended");

//   const particlesInit = useCallback(async (engine: Engine) => {
//     await loadStarsPreset(engine);
//   }, []);

//   const particlesOptions = {
//     preset: "stars",
//     background: {
//       color: {
//         value: "#000",
//       },
//     },
//     particles: {
//       move: {
//         speed: 1,
//       },
//     },
//   };

//   return (
//     <div className="relative w-full min-h-screen">
//       <Particles
//         id="tsparticles"
//         init={particlesInit}
//         options={particlesOptions}
//       />
//       {/* NGUBAH INI JG: */}
//       <div className="flex flex-col w-full relative items-center justify-center h-screen">
//         {phase === "question" && (
//           //NGUBAH INI:
//           <div className="text-center flex flex-col gap-3">
//             <h1 className="text-4xl font-bold">Round 1</h1>
//             <p className="text-xl">THIS IS QUESTION</p>
//             <p className="text-sm">Read the question carefully</p>
//             <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//               <div className="h-full bg-primary"></div>
//             </div>
//           </div>
//         )}

//         {phase === "answer" && (
//           //NGUBAH INI YG STYLE
//           <div
//             className="text-center w-full max-w-2xl p-4"
//             style={{
//               backdropFilter: "blur(1px)",
//               backgroundColor: "rgba(255, 255, 255, 0.25)",
//               boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
//               borderRadius: "16px",
//               border: "1px solid rgba(255, 255, 255, 0.18)",
//             }}
//           >
//             <div className="flex justify-between">
//               <div>Round 1</div>
//               <div>Timer: 60s</div>
//             </div>
//             <p className="text-xl mb-4">THIS IS THE QUESTION</p>
//             {/* NGUBAH INI YG TEXT AREA */}
//             <Textarea
//               className="w-full p-2 border rounded h-56"
//               placeholder="Type your answer here..."
//             ></Textarea>
//             <Button className="mt-4 bg-primary text-primary-foreground">
//               Lock Answer
//             </Button>
//           </div>
//         )}

//         {phase === "judging" && (
//           // CUMA NGUBAH INI DOANG
//           <div className="text-center flex flex-col gap-3">
//             <h1 className="text-4xl font-bold">Judging...</h1>
//             <p className="text-xl">Algoat is Judging...</p>
//             <p>message</p>
//           </div>
//         )}

//         {phase === "leaderboard" && (
//           <div className="text-center flex flex-col gap-4 p-8">
//             <h1 className="text-4xl font-bold">Leaderboard</h1>
//             <Table className="bg-gray-300/20 backdrop-blur-sm rounded-lg">
//               <TableHeader className="">
//                 <TableRow>
//                   <TableHead className="text-xl text-left px-32">
//                     Player
//                   </TableHead>
//                   <TableHead className="text-xl text-left px-12">
//                     Score
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {leaderboard.map((player, index) => (
//                   <TableRow key={index}>
//                     <TableCell className="text-lg text-left">
//                       {player.player}
//                     </TableCell>
//                     <TableCell className="text-lg text-left">
//                       {player.score}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         )}

//         {phase === "ended" && (
//           // GANTI INI
//           <div className="text-center flex flex-col gap-3">
//             <h1 className="text-4xl font-bold">Game Over</h1>
//             <p className="text-xl">Message</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlayPage;
