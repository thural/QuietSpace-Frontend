import { ResId } from "@/api/schemas/native/common";
import BoxStyled from "@/components/shared/BoxStyled";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import PostMessageSkeleton from "@/components/shared/PostMessageSkeleton";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { useGetPostById } from "@/services/data/usePostData";
import PostCardBase from "./PostCardBase";

/**
 * Props for the PostMessageCard component.
 * 
 * @interface PostMessageCardProps
 * @extends GenericWrapper
 * @property {ResId} postId - The ID of the post to load.
 * @property {number} [lineClamp] - Optional number of lines to clamp the post content.
 * @property {React.CSSProperties} style - Additional styles to apply to the component.
 */
interface PostMessageCardProps extends GenericWrapper {
    postId: ResId;
    lineClamp?: number;
    style: React.CSSProperties;
}

/**
 * PostMessageCard component.
 * 
 * This component fetches a post by its ID and displays it in a styled card format.
 * It handles loading and error states, rendering a skeleton while the post is being
 * fetched and displaying an error message if the fetch fails. Once the post is loaded,
 * it renders the PostCardBase component within a styled box.
 * 
 * @param {PostMessageCardProps} props - The component props.
 * @returns {JSX.Element} - The rendered PostMessageCard component, which may be a loading skeleton,
 *                          an error message, or the PostCardBase component.
 */
const PostMessageCard: React.FC<PostMessageCardProps> = ({ postId, lineClamp = 7, style }) => {

    // Define the default styles for the component
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
        backgroundColor: 'blue',
        boxShadow: '0px 0px 16px -16px'
    }; // TODO: refactor for JSS

    // Merge default styles with any additional styles passed as props
    const mergedStyle = { ...componentStyle, ...style, backgroundColor: '#333333' };

    // Fetch the post data using the custom hook
    const { data: post, isLoading, isError, error } = useGetPostById(postId);

    // Render a loading skeleton while the post data is being fetched
    if (isLoading) return <PostMessageSkeleton style={mergedStyle} />;

    // Render an error component if there was an error fetching the post or if the post data is undefined
    if (isError || post === undefined) return <ErrorComponent message={error?.message} />;

    // Render the PostCardBase component with the fetched post data
    return (
        <BoxStyled style={mergedStyle}>
            <PostCardBase post={post} lineClamp={lineClamp} />
        </BoxStyled>
    );
}

export default PostMessageCard;