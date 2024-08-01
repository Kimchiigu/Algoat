"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axiosConfig";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useParams } from "next/navigation";

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

const PlayPage = () => {
  const { id } = useParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [phase, setPhase] = useState<"question" | "answer" | "judging">(
    "question"
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchSessionId = async () => {
      const roomDocRef = doc(db, "Rooms", id as string);
      const roomDoc = await getDoc(roomDocRef);
      if (roomDoc.exists() && roomDoc.data().sessionId) {
        const sessionId = roomDoc.data().sessionId;
        setSessionId(sessionId);
        fetchQuestion(sessionId);
      } else {
        const { data } = await axios.post("/start_game");
        setSessionId(data.session_id);
        await updateDoc(roomDocRef, { sessionId: data.session_id });
        fetchQuestion(data.session_id);
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

  const submitAnswers = async () => {
    if (!sessionId) return;
    try {
      const { data } = await axios.post<JudgementResponse>(
        `/submit_answers/${sessionId}`,
        { answers }
      );
      setMessage(`Winner: ${data.winner}`);
      setPhase("judging");
      setTimer(10); // Judging phase time
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const timeoutId = setTimeout(() => {
        const newTimer = timer - 1;
        setTimer(newTimer);
      }, 1000);
      return () => clearTimeout(timeoutId);
    } else if (timer === 0 && phase === "question") {
      setPhase("answer");
      setTimer(60); // Set to answer time from settings
    } else if (timer === 0 && phase === "answer") {
      submitAnswers();
    } else if (timer === 0 && phase === "judging") {
      fetchQuestion(sessionId!);
    }
  }, [timer, phase, sessionId]);

  const handleAnswerChange = (player: string, answer: string) => {
    setAnswers((prevAnswers) => {
      const existingAnswer = prevAnswers.find((a) => a.player === player);
      if (existingAnswer) {
        existingAnswer.answer = answer;
      } else {
        prevAnswers.push({ player, answer });
      }
      return [...prevAnswers];
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      {phase === "question" && (
        <div className="text-center">
          <h1 className="text-4xl font-bold">Round 1</h1>
          <p className="text-xl">{question}</p>
          <p className="text-sm">Read the question carefully</p>
          <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${(timer / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {phase === "answer" && (
        <div className="text-center w-full max-w-2xl p-4">
          <div className="flex justify-between">
            <div>Round 1</div>
            <div>Timer: {timer}s</div>
          </div>
          <p className="text-xl mb-4">{question}</p>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Type your answer here..."
            onChange={(e) => handleAnswerChange("player1", e.target.value)}
          ></textarea>
          <Button
            className="mt-4 bg-primary text-primary-foreground"
            onClick={submitAnswers}
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
    </div>
  );
};

export default PlayPage;
