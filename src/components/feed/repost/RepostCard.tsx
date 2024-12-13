import { PostResponse } from "@/api/schemas/inferred/post";
import BoxStyled from "@/components/shared/BoxStyled";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import FlexStyled from "@/components/shared/FlexStyled";
import PostSkeleton from "@/components/shared/PostSkeleton";
import Typography from "@/components/shared/Typography";
import UserDetails from "@/components/shared/UserDetails";
import { useGetUserById } from "@/services/data/useUserData";
import { useRepost } from "@/services/hook/feed/useRepost";
import styles from "@/styles/feed/repostCardStyles";
import { isRepost } from "@/utils/typeUtils";
import { PiArrowsClockwiseBold } from "react-icons/pi";
import PostMenu from "../fragments/PostMenu";
import PostCard from "../post/PostCard";

/**
 * Props for the RepostCard component.
 * 
 * @interface RepostCardProps
 * @property {boolean} [isPostsLoading] - Optional flag indicating if posts are currently loading.
 * @property {PostResponse} post - The post data object that this repost card is associated with.
 */
interface RepostCardProps {
    isPostsLoading?: boolean;
    post: PostResponse;
}

/**
 * RepostCard component.
 * 
 * This component displays a reposted post along with user details and additional interactions.
 * It fetches user information based on the reposted post's user ID and handles loading and error states.
 * If an error occurs or data is still loading, it renders an appropriate loading skeleton or error message.
 * Once the data is successfully fetched, it renders the repost details along with the original post.
 * 
 * @param {RepostCardProps} props - The component props.
 * @returns {JSX.Element} - The rendered RepostCard component, which may show a loading skeleton,
 *                          an error message, or the repost and original post details.
 */
const RepostCard: React.FC<RepostCardProps> = ({ post, isPostsLoading = false }) => {
    const classes = styles();
    let data = undefined;

    try {
        // Validate that the post is a valid repost
        if (!post.repost || !isRepost(post.repost)) throw new TypeError('object is not repost');
        data = useRepost(post.repost);
    } catch (error) {
        // Render an error component if an error occurs during data fetching
        return <ErrorComponent message={(error as Error).message} />;
    }

    const { data: user, isLoading, isError, error } = useGetUserById(post.repost.userId);

    // Render an error component if there was an error fetching user data
    if (isError) return <ErrorComponent message={error?.message} />;

    // Render a loading skeleton if user data is still being fetched or if posts are loading
    if (isPostsLoading || isLoading || user === undefined) return <PostSkeleton />;

    // Render the repost card with user details, repost content, and the original post
    return (
        <BoxStyled className={classes.repostCard}>
            <FlexStyled className={classes.postHeadline}>
                <PiArrowsClockwiseBold className="repost-icon" />
                <UserDetails scale={5} user={user} isDisplayEmail={false} />
                <Typography>reposted</Typography>
                <PostMenu postId={post.repost.id} isRepost={true} {...data} />
            </FlexStyled>
            <Typography className={classes.replyText}>{post.repost.text}</Typography>
            <PostCard post={post} isMenuHidden={true} />
        </BoxStyled>
    );
}

export default RepostCard;