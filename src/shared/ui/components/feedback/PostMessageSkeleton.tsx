import { Skeleton } from "@/shared/ui/components";
import { Container } from '@/shared/ui/components/layout/Container';

interface PostMessageSkeletonProps {
    style?: React.CSSProperties
}

const PostMessageSkeleton: React.FC<PostMessageSkeletonProps> = ({ style }) => (
    <Container style={{ ...style, minWidth: '172px', height: '256px' }}>
        <Skeleton width={50} height={50} radius="50%" style={{ marginBottom: '24px' }} />
        <Skeleton height={8} radius="8px" />
        <Skeleton height={8} style={{ marginTop: '6px' }} radius="8px" />
        <Skeleton height={8} style={{ marginTop: '6px', width: '70%' }} radius="8px" />
    </Container>
);

export default PostMessageSkeleton;