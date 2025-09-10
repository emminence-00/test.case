// app/route/[data]/page.js

"use client";
import { usePathname, useParams } from 'next/navigation'
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const quiz = {
  title: "Random Quiz",
  questions: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      answer: 2,
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      answer: 1,
    },
    {
      id: 3,
      question: "Who wrote 'Hamlet'?",
      options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
      answer: 1,
    },
  ],
};

export default function DynamicRoute() {
  const pathname = usePathname()
  const params = useParams()

  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIdx: number, optIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = optIdx;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = answers.reduce(
    (acc, ans, idx) =>
      ans === quiz.questions[idx].answer ? acc + 1 : acc,
    0
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300 p-8 pb-20 font-sans flex flex-col items-center">
      <Card className="w-full max-w-xl mx-auto bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center mb-2">{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {quiz.questions.map((q, qIdx) => (
              <Card
                key={q.id}
                className={`bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm transition-all duration-200 ${submitted && answers[qIdx] === q.answer ? 'border-green-500' : ''}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    {qIdx + 1}. {q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt, optIdx) => (
                      <label key={optIdx} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border transition-colors
                        ${answers[qIdx] === optIdx ? "border-zinc-400 bg-zinc-200 dark:bg-zinc-800" : "border-zinc-200 dark:border-zinc-800"}
                        ${submitted && optIdx === q.answer ? "border-green-500 bg-green-100 dark:bg-green-900" : ""}
                      `}>
                        <input
                          type="radio"
                          name={`q${qIdx}`}
                          checked={answers[qIdx] === optIdx}
                          disabled={submitted}
                          onChange={() => handleSelect(qIdx, optIdx)}
                          className="accent-zinc-900 dark:accent-zinc-100"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          {!submitted ? (
            <Button onClick={handleSubmit} className="w-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg">
              Submit Answers
            </Button>
          ) : (
            <div className="w-full text-center animate-bounce-in">
              <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
                Your Score: {score} / {quiz.questions.length}
              </div>
              <div className="text-sm opacity-80">Correct answers are highlighted in green.</div>
            </div>
          )}
        </CardFooter>
      </Card>
      <style jsx global>{`
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.7s cubic-bezier(.68,-0.55,.27,1.55);
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 2s linear infinite alternate;
        }
      `}</style>
    </div>
  );
}