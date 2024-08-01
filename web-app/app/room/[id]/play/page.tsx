"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axiosConfig"; // Import axios from the configuration file
import { useParams } from "next/navigation";

interface QuestionResponse {
  question: string;
}

interface Answer {
  player: string;
  answer: string;
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

  useEffect(() => {
    if (!id) return;

    // Start the game and fetch the first question
    const startGame = async () => {
      try {
        console.log("Starting game...");
        const { data } = await axios.post(`http://localhost:8000/start_game`); // Use full URL for debugging
        console.log("Game started, data:", data);
        setSessionId(data.session_id);
        fetchQuestion(data.session_id);
      } catch (error) {
        console.error("Error starting the game:", error);
        if (axios.isAxiosError(error)) {
          console.error("Axios error details:", {
            code: error.code,
            message: error.message,
            config: error.config,
            request: error.request,
          });
        }
      }
    };

    startGame();
  }, [id]);

  const fetchQuestion = async (session_id: string) => {
    try {
      console.log("Fetching question for session:", session_id);
      const { data } = await axios.get<QuestionResponse>(
        `http://localhost:8000/get_question/${session_id}`
      );
      console.log("Fetched question:", data);
      setQuestion(data.question);
      setTimer(5); // 5 seconds to read the question
      setPhase("question");
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const submitAnswers = async () => {
    if (!sessionId) return;
    try {
      console.log("Submitting answers for session:", sessionId);
      await axios.post(`http://localhost:8000/submit_answers/${sessionId}`, {
        answers,
      });
      setPhase("judging");
      setTimer(10); // 10 seconds judging phase
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const timeoutId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timeoutId);
    }

    if (timer === 0) {
      if (phase === "question") {
        setPhase("answer");
        setTimer(60); // Set to answer time from settings
      } else if (phase === "answer") {
        submitAnswers();
      } else if (phase === "judging") {
        fetchQuestion(sessionId!);
      }
    }
  }, [timer, phase]);

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
        </div>
      )}
    </div>
  );
};

export default PlayPage;
