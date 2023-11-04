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
import {
  Box,
  Heading,
  Flex,
  Text,
  VStack,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";

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

  const bg = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.900", "gray100");

  return (
    <Flex align="center" justify="center" height="100vh" bg={bg}>
      <Box
        p={8}
        width="100%"
        maxWidth="500px"
        borderRadius={8}
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={4} align="start">
          <Heading size="xl" color={textColor}>
            Answer Page
          </Heading>
          {quiz ? (
            <>
              <Heading size="md" color={textColor}>
                Question: {quiz.data.question}
              </Heading>
              <AnswerCheck correctAnswer={quiz.data.answer} />
            </>
          ) : (
            <Flex>
              <Spinner />
              <Text>現在問題作成中です</Text>
            </Flex>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};
