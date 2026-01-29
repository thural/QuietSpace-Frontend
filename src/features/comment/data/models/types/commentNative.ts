// Native types for comment functionality
export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PagedCommentResponse {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
