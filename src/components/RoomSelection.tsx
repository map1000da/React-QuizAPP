import React, { useState, useEffect } from "react";
import {
  Button,
  useDisclosure,
  Box,
  VStack,
  Grid,
  Heading,
} from "@chakra-ui/react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LogoutButton } from "./LogoutButton";
import { Room } from "../schemas/Room";
import { CreateRoomModal } from "./CreateRoomModal";

export const RoomSelection: React.FC = () => {
  //利用可能な部屋一覧
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  //Modal用
  const { isOpen, onOpen, onClose } = useDisclosure();

  //DBから部屋の一覧を非同期に取得．新しい部屋が追加されたりしたら自動的に更新
  useEffect(() => {
    const roomsRef = collection(db, "rooms");
    const unsubscribe = onSnapshot(query(roomsRef), (snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as Room["data"],
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  //与えられたroomIdに基づいてFirestoreから該当する部屋のデータを取得
  const handleJoinRoom = (roomId: string) => {
    console.log(roomId, `/role-selection/${roomId}`);
    navigate(`/role-selection/${roomId}`);
  };

  return (
    <div>
      <Box>
        <VStack spacing={4}>
          <Heading h="h2">Join room</Heading>
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap={4}
            w="80%"
            mt={4}
            alignItems="center"
            justifyItems="center"
          >
            {/* ヘッダー部分 */}
            <Box fontWeight="bold" textAlign="center">
              room名
            </Box>
            <Box fontWeight="bold" textAlign="center">
              作成者
            </Box>
            <Box></Box>

            {/* 中身部分 */}
            {rooms.map((room) => (
              <React.Fragment key={room.id}>
                <Box>{room.data.roomName}</Box>
                <Box>{room.data.creatorId}</Box>
                <Button onClick={() => handleJoinRoom(room.id)}>Join</Button>
              </React.Fragment>
            ))}
          </Grid>
        </VStack>
      </Box>
      <Box>
        <VStack spacing={4}>
          <Button onClick={onOpen}>Create Room</Button>
          <CreateRoomModal isOpen={isOpen} onClose={onClose} />
        </VStack>
      </Box>
      <Box>
        <LogoutButton />
      </Box>
    </div>
  );
};
