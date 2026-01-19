import React from 'react';
import { PostResponse } from "@/api/schemas/inferred/post";
import { Text } from "@mantine/core";
import PostHeader from "../presentation/components/fragments/PostHeader";


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