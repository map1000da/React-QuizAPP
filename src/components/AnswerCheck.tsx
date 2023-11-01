import React, { useState } from "react";

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
    <div>
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="回答を入力してください"
      />
      <button onClick={handleSubmit}>回答を提出する</button>

      {isCorrect !== null && <div>{isCorrect ? "正解" : "不正解"}</div>}
    </div>
  );
};
