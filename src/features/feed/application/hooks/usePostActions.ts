import { ContentType } from "@/shared/api/models/commonNative";
import { ReactionType } from "@/features/feed/data/models/reactionNative";
import { useFeedServices } from "./useFeedService";
import { useFeatureAuth } from '@/core/modules/authentication/hooks/useFeatureAuth';
import { ResId } from "@/shared/api/models/common";

const usePostActions = (postId: ResId) => {
    const { authData } = useFeatureAuth();
    const { feedFeatureService } = useFeedServices();

    const handleDeletePost = async (e: React.MouseEvent) => {
        e && e.stopPropagation();

        try {
            await feedFeatureService.deletePostWithBusinessLogic(
                postId,
                authData.user.id,
                authData.accessToken
            );
        } catch (error) {
            console.error('Error deleting post:', error);
            // Error handling is done in the feature service
        }
    };

    const handleLike = async (e: React.MouseEvent) => {
        e && e.stopPropagation();

        try {
            await feedFeatureService.interactWithPost(
                postId,
                authData.user.id,
                'like',
                authData.accessToken
            );
        } catch (error) {
            console.error('Error liking post:', error);
            // Error handling is done in the feature service
        }
    };

    const handleDislike = async (e: React.MouseEvent) => {
        e && e.stopPropagation();

        try {
            await feedFeatureService.interactWithPost(
                postId,
                authData.user.id,
                'dislike',
                authData.accessToken
            );
        } catch (error) {
            console.error('Error disliking post:', error);
            // Error handling is done in the feature service
        }
    };

    return { handleDeletePost, handleLike, handleDislike };
};

export default usePostActions;
