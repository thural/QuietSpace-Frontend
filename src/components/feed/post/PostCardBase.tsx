import { PostResponse } from "@/api/schemas/inferred/post";
import { Text } from "@mantine/core";
import PostHeadline from "../fragments/PostHeadline";


interface PostCardBaseProps {
    post: PostResponse
    lineClamp?: number
}


const PostCardBase: React.FC<PostCardBaseProps> = ({ post, lineClamp = 5 }) => (
    <>
        <PostHeadline post={post} />
        <Text lineClamp={lineClamp} >{post.text}</Text>
    </>
);

export default PostCardBase