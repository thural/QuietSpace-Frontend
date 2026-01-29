import { Skeleton } from "@/shared/ui/components"
import { Container } from '@/shared/ui/components/layout/Container'

const PostSkeleton = () => {
    return (
        <Container style={{ width: "100%", margin: "1rem" }}>
            <Skeleton width={50} height={50} radius="50%" style={{ marginBottom: '24px' }} />
            <Skeleton height={8} radius="8px" />
            <Skeleton height={8} style={{ marginTop: '6px' }} radius="8px" />
            <Skeleton height={8} style={{ marginTop: '6px', width: '70%' }} radius="8px" />
        </Container>
    )
}

export default PostSkeleton