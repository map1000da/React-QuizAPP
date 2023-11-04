import React, { useState } from "react";
import { Box, VStack, Text, Input, Button } from "@chakra-ui/react";

interface Props {
  correctAnswer: string;
}

export const AnswerCheck: React.FC<Props> = (props) => {
  const { correctAnswer } = props;
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (userAnswer === correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <Box>
      <VStack spacing={4} w="100%">
        <Input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="回答を入力してください"
        />
        <Button colorScheme="teal" onClick={handleSubmit}>
          回答提出
        </Button>

        {isCorrect !== null && <div>{isCorrect ? "正解" : "不正解"}</div>}
      </VStack>
    </Box>
  );
};
