import { Button, Box, Heading, Flex, Stack } from "@chakra-ui/react";
import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Login: React.FC = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((err) => alert(err.message));
  };
  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="gray.100" w="sm" p={4} borderRadius="md" shadow="md">
        <Stack spacing={10} py={4} px={8}>
          <Heading as="h2" size="lg" textAlign="center">
            ログイン
          </Heading>
          <Button
            bg="teal.400"
            onClick={signInWithGoogle}
            _hover={{ opacity: 0.8 }}
          >
            Googleでログインする
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Login;
