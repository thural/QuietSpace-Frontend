import { Post } from "@/api/schemas/inferred/post";
import UserCard from "@/components/chat/components/sidebar/query/UserCard";
import Conditional from "@/components/shared/Conditional";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import { ConsumerFn } from "@/types/genericTypes";
import PostMenu from "../shared/post-menu/PostMenu";

const style = {
    position: 'relative',
    gap: '.8rem'
}

interface PostHeadlineProps {
    post: Post
    isMenuHidden: boolean
    isMutable: boolean
    handleDelete: ConsumerFn
    handleUserClick: ConsumerFn
    toggleEditForm: ConsumerFn
}

const PostHeadline: React.FC<PostHeadlineProps> = ({ post, isMenuHidden, isMutable, handleDelete, handleUserClick, toggleEditForm }) => (
    <FlexStyled styles={style} onClick={(e: MouseEvent) => e.stopPropagation()}>
        <UserCard userId={post.userId} onClick={(e: Event) => handleUserClick(e, post.userId)}>
            <Typography className="title" type="h5">{post.title}</Typography>
        </UserCard>
        <Conditional isEnabled={!isMenuHidden}>
            <PostMenu postId={post.id} handleDeletePost={handleDelete} toggleEditForm={toggleEditForm} isMutable={isMutable} />
        </Conditional>
    </FlexStyled>
);

export default PostHeadline