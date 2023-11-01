import React from "react";
import { auth } from "../firebaseConfig";
import { error } from "console";
import { Button } from "@chakra-ui/react";

export const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Successfully logged out!");
      })
      .catch((error) => {
        console.error("Erro logging out:", error);
      });
  };

  return <Button onClick={handleLogout}>ログアウト</Button>;
};
