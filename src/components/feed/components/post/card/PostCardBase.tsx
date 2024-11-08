import { User } from "@/api/schemas/inferred/user";
import UserCard from "@/components/chat/components/sidebar/query/UserCard";
import BoxStyled from "@/components/shared/BoxStyled";
import FlexStyled from "@/components/shared/FlexStyled";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import Typography from "@/components/shared/Typography";
import styles from "../styles/postStyles";


interface PostCardBaseProps {
    title: string
    text: string
    signedUser: User
}


const PostCardBase: React.FC<PostCardBaseProps> = ({ title, text, signedUser }) => {

    const classes = styles();


    const PostHeadLine = () => (
        <FlexStyled className={classes.postHeadline}>
            <UserCard user={signedUser}>
                <Typography className="title" type="h5">{title}</Typography>
            </UserCard>
        </FlexStyled>
    );

    const PostContent: React.FC<GenericWrapper> = ({ onClick }) => (
        <BoxStyled className="content" onClick={onClick}>
            <Typography className="text">{text}</Typography>
        </BoxStyled>
    );


    return (
        <BoxStyled className={classes.wrapper} >
            <PostHeadLine />
            <PostContent />
        </BoxStyled>
    );
};

export default PostCardBase;