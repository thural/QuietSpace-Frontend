import { Skeleton } from "@/shared/ui/components";
import { Container } from '@/shared/ui/components/layout/Container';
import { PureComponent, ReactNode } from 'react';
import { getComponentSize, getSpacing, getRadius } from '../utils';

interface IPostMessageSkeletonProps {
    style?: React.CSSProperties;
    theme?: any;
}

class PostMessageSkeleton extends PureComponent<IPostMessageSkeletonProps> {
    override render(): ReactNode {
        const { style, theme } = this.props;

        return (
            <Container style={{
                ...style,
                minWidth: getComponentSize(theme, 'skeleton', 'minWidth'),
                height: getComponentSize(theme, 'skeleton', 'height')
            }}>
                <Skeleton
                    width={getComponentSize(theme, 'avatar', 'md')}
                    height={getComponentSize(theme, 'avatar', 'md')}
                    radius="round"
                    style={{ marginBottom: getSpacing(theme, 'md') }}
                />
                <Skeleton height={8} radius={getRadius(theme, 'sm')} />
                <Skeleton height={8} style={{ marginTop: getSpacing(theme, 'xs') }} radius={getRadius(theme, 'sm')} />
                <Skeleton height={8} style={{ marginTop: getSpacing(theme, 'xs'), width: '70%' }} radius={getRadius(theme, 'sm')} />
            </Container>
        );
    }
}

export default PostMessageSkeleton;