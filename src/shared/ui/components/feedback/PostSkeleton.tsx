import { Skeleton } from "@/shared/ui/components"
import { Container } from '@/shared/ui/components/layout/Container'
import { getSpacing, getRadius } from '../utils';

const PostSkeleton = () => {
    return (
        <Container style={{ width: "100%", margin: getSpacing({}, 'md') }}>
            <Skeleton width={50} height={50} radius={getRadius({}, 'full')} style={{ marginBottom: getSpacing({}, 'lg') }} />
            <Skeleton height={8} radius={getRadius({}, 'sm')} />
            <Skeleton height={8} style={{ marginTop: getSpacing({}, 'xs') }} radius={getRadius({}, 'sm')} />
            <Skeleton height={8} style={{ marginTop: getSpacing({}, 'xs'), width: '70%' }} radius={getRadius({}, 'sm')} />
        </Container>
    )
}

export default PostSkeleton