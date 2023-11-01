export interface Quiz {
  id: string;
  data: {
    question: string;
    answer: string;
    timestamp: any;
    roomId: string;
  };
}
