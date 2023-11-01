import "./App.css";
import React from "react";
import { auth } from "./firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { ChakraProvider } from "@chakra-ui/react";
import Login from "./components/Login";
import { RoomSelection } from "./components/RoomSelection";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RoleSelection } from "./components/RoleSelection";
import { QuestionCreation } from "./components/QuestionCreation";
import { AnswerPage } from "./components/AnswerPage";

const App = () => {
  // 認証状態
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  return (
    <ChakraProvider>
      <BrowserRouter>
        <div>
          {user ? (
            <>
              <Routes>
                <Route path="/room-selection" element={<RoomSelection />} />
                <Route
                  path="/role-selection/:roomId"
                  element={<RoleSelection />}
                />
                <Route
                  path="/question-creation/:roomId"
                  element={<QuestionCreation />}
                />
                <Route path="/answer-page/:roomId" element={<AnswerPage />} />
                <Route path="*" element={<Navigate to="/room-selection" />} />
              </Routes>
            </>
          ) : (
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </div>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
