export interface Room {
  id: string;
  data: {
    roomName: string;
    questionerId: string;
    answerIds: string[];
    creatorId: string;
  };
}
