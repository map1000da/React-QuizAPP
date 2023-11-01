import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Button, Box, Heading, Flex } from "@chakra-ui/react";
import { Room } from "../schemas/Room";

export const RoleSelection: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const handleRoleSelection = async (role: "questioner" | "answer") => {
    //エラーハンドリング
    if (!auth.currentUser?.uid) {
      alert("User not logged in");
      return;
    }

    if (!roomId) {
      alert("roomId is wrong");
      return;
    }

    const userId = auth.currentUser?.uid;
    const roomRef = doc(db, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      alert("Room does not exist!");
      return;
    }

    const roomData = roomSnap.data() as Room["data"];

    if (role === "answer" && roomData.answerIds.length < 3) {
      await setDoc(
        doc(db, "users", userId),
        {
          roomId: roomId,
        },
        { merge: true }
      );
      await updateDoc(roomRef, {
        answerIds: arrayUnion(userId),
      });
      navigate(`/answer-page/${roomId}`);
    } else if (role === "questioner" && !roomData.questionerId) {
      await setDoc(
        doc(db, "uses", userId),
        {
          roomId: roomId,
        },
        { merge: true }
      );
      await updateDoc(roomRef, {
        questionerId: userId,
      });
      navigate(`/question-creation/${roomId}`);
    } else {
      alert("Selected Role is not available for this room");
    }
  };
  return (
    <Flex align="center" justify="center" height="100vh">
      <Box>
        <Heading h="h2">Select Your Role</Heading>
        <Button onClick={() => handleRoleSelection("questioner")}>
          出題者
        </Button>
        <Button onClick={() => handleRoleSelection("answer")}>回答者</Button>
      </Box>
    </Flex>
  );
};
