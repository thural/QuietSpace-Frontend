// Native types for post functionality
export interface VoteBody {
  voteType: "UP" | "DOWN";
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  multipleChoice: boolean;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}
