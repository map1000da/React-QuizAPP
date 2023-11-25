import React, { useState, useEffect } from "react";
import {
  Button,
  useDisclosure,
  Box,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Container,
  Text,
} from "@chakra-ui/react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, query, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LogoutButton } from "./LogoutButton";
import { Room } from "../schemas/Room";
import { CreateRoomModal } from "./CreateRoomModal";

export const RoomSelection: React.FC = () => {
  //利用可能な部屋一覧
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  //Modal用
  const { isOpen, onOpen, onClose } = useDisclosure();

  //uIDをもとにDBからuser_nameを取得する関数
  const fetchUserName = async (userId: string) => {
    console.log("userId", userId);
    const userRef = doc(db, "users", userId); //Firestoreの特定のドキュメントを取得する場合はdoc関数
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data().userName : "Unknown";
  };

  //DBから部屋の一覧を非同期に取得．新しい部屋が追加されたりしたら自動的に更新
  useEffect(() => {
    const roomsRef = collection(db, "rooms");
    const unsubscribe = onSnapshot(query(roomsRef), async (snapshot) => {
      // setRooms(
      //   snapshot.docs.map((doc) => ({
      //     id: doc.id,
      //     data: doc.data() as Room["data"],
      //   }))
      // );

      const roomdsData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const roomData = doc.data() as Room["data"];
          //user_nameが未取得であれば取得する．
          if (!userNames[roomData.creatorId]) {
            const userName = await fetchUserName(roomData.creatorId);
            setUserNames((prevUserNames) => ({
              ...prevUserNames,
              [roomData.creatorId]: userName,
            }));
          }
          return {
            id: doc.id,
            data: roomData,
          };
        })
      );
      setRooms(roomdsData);
    });
    return () => unsubscribe();
  }, [userNames]);

  //与えられたroomIdに基づいてFirestoreから該当する部屋のデータを取得
  const handleJoinRoom = (roomId: string) => {
    console.log(roomId, `/role-selection/${roomId}`);
    navigate(`/role-selection/${roomId}`);
  };

  return (
    <Container maxW="container.md" pt={10}>
      <VStack spacing={6} alignItems="stretch">
        <Box>
          <VStack spacing={4}>
            <Heading h="h2" size="lg" textAlign="center" mb={6}>
              Join room
            </Heading>

            <Table mt={4} mb={20}>
              <Thead bgColor="gray.100">
                <Tr>
                  <Th fontWeight="bold" textAlign="center">
                    room名
                  </Th>
                  <Th fontWeight="bold" textAlign="center">
                    作成者
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* 中身部分 */}
                {rooms.map((room) => (
                  <Tr key={room.id}>
                    {/* <Box>{room.data.roomName}</Box> */}
                    <Td textAlign="center">{room.data.roomName}</Td>
                    <Td textAlign="center">
                      {userNames[room.data.creatorId] || "Loading..."}
                    </Td>
                    <Td>
                      <Button
                        colorScheme="teal"
                        onClick={() => handleJoinRoom(room.id)}
                      >
                        Join
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </VStack>
        </Box>

        <Button colorScheme="blue" onClick={onOpen} mb={6}>
          Create Room
        </Button>
        <CreateRoomModal isOpen={isOpen} onClose={onClose} />

        <LogoutButton />
      </VStack>
    </Container>
  );
};
