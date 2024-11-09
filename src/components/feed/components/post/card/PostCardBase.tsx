import { ResId } from "@/api/schemas/native/common";
import UserCard from "@/components/chat/components/sidebar/query/UserCard";
import BoxStyled from "@/components/shared/BoxStyled";
import FlexStyled from "@/components/shared/FlexStyled";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import Typography from "@/components/shared/Typography";
import styles from "../styles/postStyles";


interface PostCardBaseProps {
    title: string
    text: string
    userId: ResId
}


const PostCardBase: React.FC<PostCardBaseProps> = ({ title, text, userId }) => {

    const classes = styles();


    const PostHeadLine = () => (
        <FlexStyled className={classes.postHeadline}>
            <UserCard userId={userId}>
                <Typography className="title" type="h5">{title}</Typography>
            </UserCard>
        </FlexStyled>
    );

    const PostContent: React.FC<GenericWrapper> = ({ onClick }) => (
        <BoxStyled className="content" onClick={onClick}>
            <Typography >{text}</Typography>
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