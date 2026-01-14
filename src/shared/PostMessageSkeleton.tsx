import { Skeleton } from "@mantine/core";
import BoxStyled from "./BoxStyled";

interface PostMessageSkeletonProps {
    style?: React.CSSProperties
}

const PostMessageSkeleton: React.FC<PostMessageSkeletonProps> = ({ style }) => (
    <BoxStyled style={{ ...style, minWidth: '172px', height: '256px' }}>
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </BoxStyled >
);

export default PostMessageSkeleton;