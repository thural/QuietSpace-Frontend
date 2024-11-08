import BoxStyled from "@/components/shared/BoxStyled"
import PostCard from "../post/card/PostCard"
import Typography from "@/components/shared/Typography"
import { ResId } from "@/api/schemas/native/common"

interface RepostCardProps {
    postId: ResId
    text: string
}

const RepostCard: React.FC<RepostCardProps> = ({ postId, text }) => {

    return (
        <BoxStyled>
            <Typography>{text}</Typography>
            <PostCard postId={postId} />
        </BoxStyled>
    )
}

export default RepostCard