import { ResId } from "@/api/schemas/native/common"
import BoxStyled from "@/components/shared/BoxStyled"
import ErrorComponent from "@/components/shared/error/ErrorComponent"
import PostMessageSkeleton from "@/components/shared/PostMessageSkeleton"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"
import { useGetPostById } from "@/services/data/usePostData"
import PostCardBase from "./PostCardBase"

interface PostMessageCardProps extends GenericWrapper {
    postId: ResId
    lineClamp?: number
    style: React.CSSProperties
}

const PostMessageCard: React.FC<PostMessageCardProps> = ({ postId, lineClamp = 7, style }) => {

    const componentStyle: React.CSSProperties = {
        maxWidth: '200px',
        position: 'relative',
        border: '#a1a1a1 solid 1px',
        margin: '.3rem 0',
        display: 'flex',
        padding: '0.8rem',
        cursor: 'pointer',
        flexFlow: 'column nowrap',
        borderRadius: '1rem',
        justifyItems: 'center',
        backgroundColor: 'white',
        boxShadow: '0px 0px 16px -16px'
    }

    const mergedStyle = { ...componentStyle, ...style, backgroundColor: 'white' };


    const { data: post, isLoading, isError, error } = useGetPostById(postId);

    if (isLoading) return <PostMessageSkeleton style={mergedStyle} />
    if (isError || post === undefined) return <ErrorComponent message={error?.message} />



    return (
        <BoxStyled style={mergedStyle}>
            <PostCardBase lineClamp={lineClamp} {...post} />
        </BoxStyled>
    )
}

export default PostMessageCard