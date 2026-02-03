import { useFeatureAuth } from '@/core/modules/authentication/hooks/useFeatureAuth';
import { ResId } from "@/shared/api/models/common";
import { useFeedServices } from "./useFeedService";

const usePostActions = (postId: ResId) => {
    const { authData } = useFeatureAuth();
    const { feedFeatureService } = useFeedServices();

    const handleDeletePost = async (e: React.MouseEvent) => {
        e && e.stopPropagation();

        if (!authData?.user?.id) {
            console.error('User not authenticated or missing user ID');
            return;
        }

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

        if (!authData?.user?.id) {
            console.error('User not authenticated or missing user ID');
            return;
        }

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

        if (!authData?.user?.id) {
            console.error('User not authenticated or missing user ID');
            return;
        }

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
