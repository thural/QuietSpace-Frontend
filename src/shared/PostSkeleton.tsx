import { Skeleton } from "@mantine/core"
import BoxStyled from "./BoxStyled"

const PostSkeleton = () => {
    return (
        <BoxStyled style={{ width: "100%", margin: "1rem" }}>
            <Skeleton height={50} circle mb="xl" />
            <Skeleton height={8} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </BoxStyled>
    )
}

export default PostSkeleton