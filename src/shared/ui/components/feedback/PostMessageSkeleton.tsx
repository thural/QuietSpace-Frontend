import { Skeleton } from "@/shared/ui/components";
import { Container } from '@/shared/ui/components/layout/Container';
import { PureComponent, ReactNode } from 'react';
import { getSkeletonStyles, getComponentSize, getSpacing, getRadius } from '../utils';

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
                ...(theme && getSkeletonStyles(theme))
            }}>
                <Skeleton
                    width={theme ? getComponentSize(theme || {} as any, 'avatar', 'md') : '40px'}
                    height={theme ? getComponentSize(theme || {} as any, 'avatar', 'md') : '40px'}
                    radius="round"
                    style={{ marginBottom: theme ? getSpacing(theme || {} as any, 'md') : '16px' }}
                />
                <Skeleton height={8} radius={theme ? getRadius(theme || {} as any, 'sm') : '4px'} />
                <Skeleton height={8} style={{ marginTop: theme ? getSpacing(theme || {} as any, 'xs') : '8px' }} radius={theme ? getRadius(theme || {} as any, 'sm') : '4px'} />
                <Skeleton height={8} style={{ marginTop: theme ? getSpacing(theme || {} as any, 'xs') : '8px', width: '70%' }} radius={theme ? getRadius(theme || {} as any, 'sm') : '4px'} />
            </Container>
        );
    }
}

export default PostMessageSkeleton;