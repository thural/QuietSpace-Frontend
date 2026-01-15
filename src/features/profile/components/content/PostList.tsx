import React from "react";

import BaseUserPostList from "../../list/UserPostList";
import type { ResId } from "@/api/schemas/native/common";

interface PostListProps {
  userId: ResId;
  isReposts?: boolean;
  isSavedPosts?: boolean;
  isRepliedPosts?: boolean;
}

const PostList: React.FC<PostListProps> = (props) => {
  return <BaseUserPostList {...props} />;
};

export default PostList;
