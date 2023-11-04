import { Timestamp, addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { Form, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

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

  const bg = useColorModeValue("gray.50", "gray.700");

  return (
    <Flex height="100vh" width="100vw" justifyContent="center" m={0} p={0}>
      <Box width="100%" bg={bg} p={10} rounded="md" shadow="base">
        <VStack spacing={5}>
          <Heading as="h1">Create Quiz</Heading>

          <FormControl id="question">
            <FormLabel>問題文を入力してください</FormLabel>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Write Your Quiz Question"
            />
          </FormControl>

          <FormControl id="answer">
            <FormLabel>問題の回答を入力してください</FormLabel>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write the anser here"
            />
          </FormControl>

          <Button colorScheme="teal" onClick={handleSubmit}>
            Submit Quiz
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};
