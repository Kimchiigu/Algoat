"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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

interface QuestionResponse {
  question: string;
  timer: number;
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);
  const [phase, setPhase] = useState<
    "question" | "answer" | "judging" | "ended" | "leaderboard"
  >("question");
  const [message, setMessage] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<
    { player: string; score: number }[]
  >([]);
  const { currentUser } = useUserStore();

  // Get the room data
  const [roomData, setRoomData] = useState(null);
  const [playersList, setPlayersList] = useState<Player[]>([]);

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
      if (roomDoc.exists() && roomDoc.data()?.sessionId) {
        const sessionId = roomDoc.data().sessionId;
        setSessionId(sessionId);
        fetchQuestion(sessionId);
      } else {
        // Wait until playersList is set
        if (playersList.length > 0) {
          const { data } = await axios.post("/start_game", {
            room_id: id as string,
            participants: playersList?.map((player) => player.userName),
          });
          setSessionId(data.session_id);
          await updateDoc(roomDocRef, { sessionId: data.session_id });
          fetchQuestion(data.session_id);
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
      setTimer(data.timer);
      setPhase("question");
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
          setPhase("question");
          fetchQuestion(sessionId);
          console.log("question");
        } else if (data.status === "answer") {
          setPhase("answer");
          console.log("answer");
        } else if (data.status === "judging") {
          setPhase("judging");
          console.log("judging");
        } else if (data.status === "leaderboard") {
          console.log("leaderboard");
          setPhase("leaderboard");
          fetchLeaderboard(sessionId);
        } else if (data.status === "ended") {
          setPhase("ended");
          setMessage(`Game Over`);
        }
        // Update current question index
        const gameDoc = await getDoc(doc(db, "Games", sessionId));
        if (gameDoc.exists()) {
          const gameData = gameDoc.data();
          setCurrentQuestionIndex(gameData.current_question_index || 0);
        }
      } catch (error) {
        console.error("Error checking game state:", error);
      }
    }, 5000); // check every 5 seconds

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

  // useEffect(() => {
  //   if (timer > 0) {
  //     const timeoutId = setTimeout(() => {
  //       const newTimer = timer - 1;
  //       setTimer(newTimer);
  //     }, 1000);
  //     return () => clearTimeout(timeoutId);
  //   } else if (timer === 0 && phase === "question") {
  //     setPhase("answer");
  //     setTimer(60); // Set to answer time from settings
  //   } else if (timer === 0 && phase === "answer") {
  //     lockAnswer();
  //   }
  // }, [timer, phase, sessionId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      {phase === "question" && (
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            Round {currentQuestionIndex + 1}
          </h1>
          <p className="text-xl">{question}</p>
          <p className="text-sm">Read the question carefully</p>
          <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${(timer / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {phase === "answer" && (
        <div className="text-center w-full max-w-2xl p-4">
          <div className="flex justify-between">
            <div>Round {currentQuestionIndex + 1}</div>
            <div>Timer: {timer}s</div>
          </div>
          <p className="text-xl mb-4">{question}</p>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Type your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
          ></textarea>
          <Button
            className="mt-4 bg-primary text-primary-foreground"
            onClick={lockAnswer}
          >
            Lock Answer
          </Button>
        </div>
      )}

      {phase === "judging" && (
        <div className="text-center">
          <h1 className="text-4xl font-bold">Judging...</h1>
          <p className="text-xl">Algoat is Judging...</p>
          <p>{message}</p>
        </div>
      )}

      {phase === "leaderboard" && (
        <div className="text-center">
          <h1 className="text-4xl font-bold">Leaderboard</h1>
          <ul>
            {leaderboard.map((player, index) => (
              <li key={index}>
                {player.player}: {player.score}
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase === "ended" && (
        <div className="text-center">
          <h1 className="text-4xl font-bold">Game Over</h1>
          <p className="text-xl">{message}</p>
        </div>
      )}
    </div>
  );
};

export default PlayPage;
