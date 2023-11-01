import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { Quiz } from "../schemas/Quiz";
import { AnswerCheck } from "./AnswerCheck";

export const AnswerPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const q = query(
      collection(db, "quizzes"),
      where("roomId", "==", roomId),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    console.log(q);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const quizDoc = querySnapshot.docs[0];
      console.log("quizDoc", quizDoc);
      if (quizDoc) {
        const quizData = {
          id: quizDoc.id,
          data: quizDoc.data() as Quiz["data"],
        } as Quiz;
        setQuiz(quizData);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  return (
    <div>
      <h1>Answer Page</h1>
      {quiz ? (
        <div>
          <h2>Question: {quiz.data.question}</h2>
          <AnswerCheck correctAnswer={quiz.data.answer} />
        </div>
      ) : (
        <div>現在問題作成中です</div>
      )}
    </div>
  );
};