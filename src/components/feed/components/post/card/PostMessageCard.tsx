import BoxStyled from "@/components/shared/BoxStyled"
import PostCardBase from "./PostCardBase"
import { ResId } from "@/api/schemas/native/common"
import { useGetPostById } from "@/services/data/usePostData"
import { Skeleton } from "@mantine/core"
import ErrorComponent from "@/components/shared/error/ErrorComponent"

interface PostMessageCardProps {
    postId: ResId
    lineClamp?: number
}

const PostMessageCard: React.FC<PostMessageCardProps> = ({ postId, lineClamp = 7 }) => {

    const style = {
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

    const LoadingCard = () => (
        <>
            <Skeleton height={50} circle mb="xl" />
            <Skeleton height={8} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </>
    )

    const { data: post, isLoading, isError, error } = useGetPostById(postId);

    if (isLoading) return <LoadingCard />
    if (isError || post === undefined) return <ErrorComponent message={error?.message} />

    return (
        <BoxStyled style={style}>
            <PostCardBase lineClamp={lineClamp} {...post} />
        </BoxStyled>
    )
}

export default PostMessageCard