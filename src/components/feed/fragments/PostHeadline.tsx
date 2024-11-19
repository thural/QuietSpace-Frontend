import { Post } from "@/api/schemas/inferred/post";
import UserCard from "@/components/chat/sidebar/UserCard";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { createUseStyles } from "react-jss";


const useStyles = createUseStyles({
    postHeadline: {
        position: 'relative',
        gap: '.8rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '.5rem'
    }
});

interface PostHeadlineProps extends GenericWrapper {
    post: Post
}

const PostHeadline: React.FC<PostHeadlineProps> = ({ post, children }) => {

    const classes = useStyles();

    return (
        <FlexStyled className={classes.postHeadline} onClick={(e: MouseEvent) => e.stopPropagation()}>
            <UserCard userId={post.userId} >
                <Typography type="h5">{post.title}</Typography>
            </UserCard>
            {children}
        </FlexStyled>
    )
};

export default PostHeadline