import useUserQueries from "@features/profile/data/userQueries";
import { PostResponse } from "@/features/feed/data/models/post";
import usePostNavigation from "./usePostNavigation";
import usePostActions from "./usePostActions";
import usePostForms from "./usePostForms";
import usePostComments from "./usePostComments";

/**
 * Custom hook for managing the state and logic of a post.
 *
 * This hook provides functionalities for navigation, deleting the post,
 * handling reactions (likes and dislikes), managing comment forms,
 * and retrieving comments associated with the post.
 *
 * @param {PostResponse} post - The post data to manage.
 * @returns {{
 *     comments: object,                               // The comments associated with the post.
 *     commentCount: number,                          // The total number of comments on the post.
 *     hasCommented: boolean,                         // Indicates if the signed-in user has commented on the post.
 *     shareFormview: boolean,                        // Indicates if the share form is open.
 *     handleDeletePost: (e: React.MouseEvent) => Promise<void>, // Function to handle post deletion.
 *     handleLike: (e: React.MouseEvent) => void,    // Function to handle liking the post.
 *     handleDislike: (e: React.MouseEvent) => void, // Function to handle disliking the post.
 *     isMutable: boolean,                            // Indicates if the user can modify the post (admin or author).
 *     isOverlayOpen: boolean,                        // Indicates if the edit form overlay is open.
 *     commentFormView: boolean,                      // Indicates if the comment form is visible.
 *     repostFormView: boolean,                       // Indicates if the repost form is visible.
 *     toggleShareForm: (e: Event) => void,          // Function to toggle the share form visibility.
 *     toggleRepostForm: (e: Event) => void,         // Function to toggle the repost form visibility.
 *     toggleEditForm: (e: React.MouseEvent) => void, // Function to toggle the edit form overlay.
 *     toggleCommentForm: (e: React.MouseEvent) => void, // Function to toggle the comment form visibility.
 *     handleNavigation: (e: React.MouseEvent) => void // Function to navigate to the post's detailed view.
 * }} - An object containing the post management state and handler functions.
 */
export const usePost = (post: PostResponse) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const signedUser = getSignedUserElseThrow();
    const postId = post.id;

    const { handleNavigation } = usePostNavigation(postId);
    const { handleDeletePost, handleLike, handleDislike } = usePostActions(postId);
    const forms = usePostForms();
    const { comments, commentCount, hasCommented } = usePostComments(postId, { id: signedUser.id, role: signedUser.role });

    const isMutable = signedUser?.role.toUpperCase() === "ADMIN" || post?.userId === signedUser?.id;

    return {
        comments,
        commentCount,
        hasCommented,
        shareFormview: forms.shareFormview,
        handleDeletePost,
        handleLike,
        handleDislike,
        isMutable,
        isOverlayOpen: forms.isOverlayOpen,
        commentFormView: forms.commentFormView,
        repostFormView: forms.repostFormView,
        toggleShareForm: forms.toggleShareForm,
        toggleRepostForm: forms.toggleRepostForm,
        toggleEditForm: forms.toggleEditForm,
        toggleCommentForm: forms.toggleCommentForm,
        handleNavigation,
    };
};

export default usePost;

export type PostViewModel = ReturnType<typeof usePost>;