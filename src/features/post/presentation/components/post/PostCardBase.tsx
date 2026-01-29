import React from 'react';
import { PostResponse } from "@/features/feed/data/models/post";
import { Text } from "@/shared/ui/components/typography/Text";
import PostHeader from "../fragments/PostHeader";


interface PostCardBaseProps {
    post: PostResponse;
    lineClamp?: number;
}


const PostCardBase: React.FC<PostCardBaseProps> = ({ post, lineClamp = 5 }) => (
    <>
        <PostHeader post={post} />
        <Text lineClamp={lineClamp} >{post.text}</Text>
    </>
);

export default PostCardBase;