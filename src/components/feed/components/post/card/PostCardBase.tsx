import { ResId } from "@/api/schemas/native/common";
import UserCard from "@/components/chat/components/sidebar/query/UserCard";
import BoxStyled from "@/components/shared/BoxStyled";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import styles from "../styles/postStyles";
import { Text } from "@mantine/core";


interface PostCardBaseProps {
    title: string
    text: string
    userId: ResId
    lineClamp?: number
}


const PostCardBase: React.FC<PostCardBaseProps> = ({ title, text, userId, lineClamp = 5 }) => {

    const classes = styles();


    const PostHeadLine = () => (
        <FlexStyled className={classes.postHeadline}>
            <UserCard userId={userId}>
                <Typography className="title" type="h5">{title}</Typography>
            </UserCard>
        </FlexStyled>
    );

    const PostContent = () => (
        <BoxStyled className="content">
            <Text lineClamp={lineClamp} >{text}</Text>
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