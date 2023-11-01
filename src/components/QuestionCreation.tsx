import { Button } from "@chakra-ui/react";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { Quiz } from "../schemas/Quiz";

export const QuestionCreation: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const handleSubmit = async () => {
    if (!roomId) return;

    const quizData = {
      question: question,
      answer: answer,
      timestamp: Timestamp.now(),
      roomId: roomId,
    };

    await addDoc(collection(db, "quizzes"), quizData);
    setQuestion("");
    setAnswer("");
  };

  return (
    <div>
      <h1>Create Quiz</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Write Your Quiz Question"
      />
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write the anser here"
      />
      <Button onClick={handleSubmit}>Submit Quiz</Button>
    </div>
  );
};
