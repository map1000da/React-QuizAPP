import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRoomModal: React.FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const [roomName, setRoomName] = useState<string>("");

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert("Please enter a room name");
      return;
    }

    if (!auth.currentUser?.uid) {
      alert("User not loggded in");
      return;
    }

    const newRoom = {
      roomName: roomName,
      questionerId: "",
      answerIds: [],
      creatorId: auth.currentUser.uid,
    };

    try {
      await addDoc(collection(db, "rooms"), newRoom);
      setRoomName("");
      onClose();
    } catch (error) {
      alert("There was an error:");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a new Room</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCreateRoom}>
            Create
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
