"use client";
import { useCallback, useEffect, useState } from "react";
import router, { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axiosConfig";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  getDocs,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { fetchRoomData } from "@/controller/room-controller";
import useUserStore from "@/lib/user-store";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";
import { Textarea } from "@/components/ui/textarea";
import withAuth from "@/hoc/withAuth";

interface QuestionResponse {
  question: string;
  phaseTime: any;
}

interface Answer {
  player: string;
  answer: string;
}

interface ScoreResponse {
  player: string;
  score: number;
}

interface JudgementResponse {
  question: string;
  answers: ScoreResponse[];
  winner: string;
}

interface RoomData {
  name: string;
  password: string;
  ownerId: string;
  topic: string;
  numQuestions: number;
  answerTime: number;
}

interface Player {
  userName: string;
  userId: string;
}

interface LeaderboardResponse {
  leaderboard: { player: string; score: number }[];
}

const PlayPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>(" ");
  const [timer, setTimer] = useState<number>(60);
  const [startTime, setStartTime] = useState<any>();
  const [phase, setPhase] = useState<
    "question" | "answer" | "judging" | "ended" | "leaderboard"
  >("question");
  const [message, setMessage] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<
    { player: string; score: number }[]
  >([]);
  const { currentUser } = useUserStore();
  const [answerTime, setAnswerTime] = useState(1);
  const [isLock, setIsLock] = useState(false);

  // Get the room data
  const [roomData, setRoomData] = useState(null);
  const [playersList, setPlayersList] = useState<Player[]>([]);

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

  const fetchData = async () => {
    // Fetch player list and room data
    const unsubscribePlayers = await fetchRoomData(
      id as string,
      ({ playersList, roomData }) => {
        setPlayersList(playersList);
        setRoomData(roomData);
      }
    );

    return () => {
      if (unsubscribePlayers) unsubscribePlayers();
    };
  };
  useEffect(() => {
    if (!id) return;

    const fetchSessionId = async () => {
      fetchData();
      const roomDocRef = doc(db, "Rooms", id as string);
      const roomDoc = await getDoc(roomDocRef);
      const playersCollectionRef = collection(roomDocRef, "Players");
      const playersSnapshot = await getDocs(playersCollectionRef);
      const playersList = playersSnapshot.docs.map((doc) => doc.data());
      const roomData = roomDoc.data();
      const category = roomData?.topic;

      const numQuestions = roomData?.numQuestions || 5;
      setAnswerTime(roomData?.answerTime || 1);
      console.log(id as string);
      console.log(answerTime);
      if (roomDoc.exists() && roomDoc.data()?.sessionId) {
        const sessionId = roomDoc.data().sessionId;
        setSessionId(sessionId);
        fetchQuestion(sessionId);
      } else {
        // Wait until playersList is set
        if (roomDoc.data()?.ownerId === currentUser?.id) {
          if (playersList.length > 0) {
            const { data } = await axios.post("/start_game", {
              room_id: id as string,
              participants: playersList?.map((player) => player.userName),
              category: category,
              num_questions: numQuestions,
              answer_time: answerTime,
            });
            setStartTime(data?.phase_start_time);
            setSessionId(data.session_id);
            await updateDoc(roomDocRef, { sessionId: data.session_id });
            fetchQuestion(data.session_id);
          }
        } else {
          setTimeout(() => {
            fetchSessionId();
          }, 1000);
        }
      }
    };

    fetchSessionId();
  }, [id]);

  const fetchQuestion = async (session_id: string) => {
    try {
      const { data } = await axios.get<QuestionResponse>(
        `/get_question/${session_id}`
      );
      setQuestion(data.question);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  useEffect(() => {
    if (!sessionId) return;

    const intervalId = setInterval(async () => {
      try {
        const { data } = await axios.post(`/check_game_state/${sessionId}`);
        if (data.status === "question") {
          fetchQuestion(sessionId);
          setAnswer("");
          setPhase("question");
          console.log("question");
        } else if (data.status === "answer") {
          setPhase("answer");
          console.log("answer");
        } else if (data.status === "judging") {
          setIsLock(true);
          setPhase("judging");
          console.log("judging");
        } else if (data.status === "leaderboard") {
          console.log("leaderboard");
          setPhase("leaderboard");
          setIsLock(false);
          fetchLeaderboard(sessionId);
        } else if (data.status === "ended") {
          setPhase("ended");
          setMessage(`Game Ended`);
          const timeoutId = setTimeout(() => {
            router.push(`/room/${id}`);
          }, 5000);
          const data = await axios.post(`/end_game/${sessionId}`);
          return () => clearTimeout(timeoutId);
        }
        // Update current question index
        const gameDoc = await getDoc(doc(db, "Games", sessionId));
        const gameData = gameDoc.data();
        setStartTime(gameData?.phase_start_time);
        if (gameDoc.exists()) {
          setCurrentQuestionIndex(gameData?.current_question_index || 0);
        }
      } catch (error) {
        console.error("Error checking game state:", error);
      }
    }, 1000); // check every 5 seconds

    return () => clearInterval(intervalId);
  }, [sessionId]);

  const fetchLeaderboard = async (session_id: string) => {
    try {
      const { data } = await axios.get<LeaderboardResponse>(
        `/get_leaderboard/${session_id}`
      );
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const lockAnswer = async () => {
    if (!sessionId) return;
    setIsLock(true);
    try {
      await axios.post(`/submit_answer/${sessionId}`, {
        player: currentUser?.id,
        username: playersList?.find(
          (player) => player.userId === currentUser?.id
        )?.userName,
        answer: answer,
      });
    } catch (error) {
      console.error("Error locking answer:", error);
    }
  };

  const calculateScores = async () => {
    if (!sessionId) return;
    try {
      const { data } = await axios.post<JudgementResponse>(
        `/calculate_scores/${sessionId}`
      );
      setMessage(`Winner: ${data.winner}`);
      setPhase("question");
      fetchQuestion(sessionId);
    } catch (error) {
      console.error("Error calculating scores:", error);
    }
  };

  useEffect(() => {
    const currentTime = new Date();
    console.log(startTime);
    if (!startTime) return;
    if (timer >= 0) {
      if (phase === "answer") {
        const timeoutId = setTimeout(() => {
          const newTimer = Math.round(
            answerTime * 60 -
              (currentTime.getTime() - new Date(startTime).getTime()) / 1000
          );
          setTimer(newTimer);
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [timer, phase]);

  const handleChange = (event: any) => {
    setAnswer(event.target.value);
  };

  return (
    <div className="relative w-full min-h-screen">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />
      <div className="flex flex-col w-full relative items-center justify-center h-screen">
        {phase === "question" && (
          <div className="text-center flex flex-col gap-3">
            <h1 className="text-4xl font-bold">
              Round {currentQuestionIndex + 1}
            </h1>
            <p className="text-xl">{question}?</p>
            <p className="text-sm">Read the question carefully</p>
          </div>
        )}

        {phase === "answer" && (
          <div
            className="text-center w-full max-w-2xl p-4"
            style={{
              backdropFilter: "blur(1px)",
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.18)",
            }}
          >
            <div className="flex justify-between">
              <div>Round {currentQuestionIndex + 1}</div>
              <div>Timer: {timer}s</div>
            </div>
            <p className="text-xl mb-4">{question}?</p>
            <Textarea
              className="w-full p-2 border rounded h-56"
              placeholder="Type your answer here..."
              value={answer} // Set the value from state
              onChange={handleChange}
              disabled={isLock}
            ></Textarea>
            {isLock || (
              <Button
                className="mt-4 bg-primary text-primary-foreground"
                onClick={lockAnswer}
              >
                Lock Answer
              </Button>
            )}
          </div>
        )}

        {phase === "judging" && (
          <div className="text-center flex flex-col gap-3">
            <h1 className="text-4xl font-bold">Judging...</h1>
            <p className="text-xl">Algoat is Judging...</p>
            <p>{message}</p>
          </div>
        )}

        {phase === "leaderboard" && (
          <div className="text-center">
            <h1 className="text-4xl font-bold">Leaderboard</h1>
            <Table className="bg-gray-300/20 backdrop-blur-sm rounded-lg">
              <TableHeader className="">
                <TableRow>
                  <TableHead className="text-xl text-left px-32">
                    Player
                  </TableHead>
                  <TableHead className="text-xl text-left px-12">
                    Score
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((player, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-lg text-left">
                      {player.player}
                    </TableCell>
                    <TableCell className="text-lg text-left">
                      {player.score}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {phase === "ended" && (
          <div className="text-center flex flex-col gap-3">
            <h1 className="text-4xl font-bold">Game Over</h1>
            <p className="text-xl">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(PlayPage, true);
