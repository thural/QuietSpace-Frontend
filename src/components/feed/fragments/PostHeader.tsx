import { PostResponse } from "@/api/schemas/inferred/post";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import UserCard from "@/components/shared/UserCard";
import { GenericWrapper } from "@/types/sharedComponentTypes";


interface PostHeadlineProps extends GenericWrapper {
    post: PostResponse
}

const PostHeader: React.FC<PostHeadlineProps> = ({ post, children }) => {
    return (
        <FlexStyled onClick={(e: MouseEvent) => e.stopPropagation()}>
            <UserCard userId={post.userId} >
                <Typography type="h5">{post.title}</Typography>
            </UserCard>
            {children}
        </FlexStyled>
    )
};

export default PostHeader