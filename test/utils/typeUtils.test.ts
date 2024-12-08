import { isComment, isUserProfile, isRepost } from '@/utils/typeUtils';
import { CommentResponse } from '@/api/schemas/inferred/comment';
import { PostResponse, RepostResponse } from '@/api/schemas/inferred/post';
import { UserProfileResponse, UserResponse } from '@/api/schemas/inferred/user';
import { ReactionType } from "@/api/schemas/native/reaction";
import { ContentType } from "@/api/schemas/native/common";

// Sample reaction for reuse
const sampleReaction = {
    userId: 1,
    contentId: 1,
    reactionType: ReactionType.LIKE,
    contentType: ContentType.POST,
    id: 1,
    username: 'user'
};

describe('typeUtils', () => {
    describe('isComment', () => {
        it('should return true if the object is a CommentResponse', () => {
            const comment: CommentResponse = {
                id: 1,
                postId: 1,
                userId: 1,
                username: 'user',
                text: 'Sample text',
                likeCount: 10,
                replyCount: 5,
                userReaction: sampleReaction
            };
            expect(isComment(comment)).toBe(true);
        });

        it('should return false if the object is a PostResponse', () => {
            const post: PostResponse = {
                id: 1,
                userId: 1,
                username: 'user',
                title: 'title',
                text: 'text',
                poll: null,
                likeCount: 10,
                dislikeCount: 0,
                commentCount: 5,
                userReaction: sampleReaction
            };
            expect(isComment(post)).toBe(false);
        });
    });

    describe('isUserProfile', () => {
        it('should return true if the object is a UserProfileResponse', () => {
            const userProfile: UserProfileResponse = {
                id: 1,
                bio: 'bio',
                role: 'role',
                username: 'username',
                email: 'email@example.com',
                isPrivateAccount: false,
                settings: {
                    id: 1,
                    blockedUserids: [],
                    bio: 'bio',
                    isPrivateAccount: false,
                    isNotificationsMuted: false,
                    isAllowPublicGroupChatInvite: true,
                    isAllowPublicMessageRequests: true,
                    isAllowPublicComments: true,
                    isHideLikeCounts: false
                }
            };
            expect(isUserProfile(userProfile)).toBe(true);
        });

        it('should return false if the object is a UserResponse', () => {
            const user: UserResponse = {
                id: 1,
                bio: 'bio',
                role: 'role',
                username: 'username',
                email: 'email@example.com',
                isPrivateAccount: false,
                isFollower: null,
                isFollowing: null
            };
            expect(isUserProfile(user)).toBe(false);
        });
    });

    describe('isRepost', () => {
        it('should return true if the object is a RepostResponse', () => {
            const repost: RepostResponse = {
                id: 1,
                text: 'text',
                userId: 1,
                parentId: 2,
                username: 'username',
                isRepost: true
            };
            expect(isRepost(repost)).toBe(true);
        });

        it('should return false if the object is a PostResponse', () => {
            const post: PostResponse = {
                id: 1,
                userId: 1,
                username: 'user',
                title: 'title',
                text: 'text',
                poll: null,
                likeCount: 10,
                dislikeCount: 0,
                commentCount: 5,
                userReaction: sampleReaction
            };
            expect(isRepost(post)).toBe(false);
        });
    });
});
