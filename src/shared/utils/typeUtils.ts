import { CommentResponse } from "@/features/feed/data/models/comment";
import { PostResponse, RepostResponse } from "@/features/feed/data/models/post";
import { UserProfileResponse, UserResponse } from "@/features/profile/data/models/user";

/**
 * Type guard to determine if an object is a CommentResponse.
 * 
 * This function checks if the provided object has a "replyCount" property,
 * indicating that it is a CommentResponse.
 * 
 * @param {PostResponse | CommentResponse} object - The object to check.
 * @returns {object is CommentResponse} - True if the object is a CommentResponse, otherwise false.
 */
export const isComment = (object: PostResponse | CommentResponse): object is CommentResponse => {
    return "replyCount" in object;
}

/**
 * Type guard to determine if an object is a UserProfileResponse.
 * 
 * This function checks if the provided object has a "settings" property,
 * indicating that it is a UserProfileResponse.
 * 
 * @param {UserResponse | UserProfileResponse} object - The object to check.
 * @returns {object is UserProfileResponse} - True if the object is a UserProfileResponse, otherwise false.
 */
export const isUserProfile = (object: UserResponse | UserProfileResponse): object is UserProfileResponse => {
    return "settings" in object;
}

/**
 * Type guard to determine if an object is a RepostResponse.
 * 
 * This function checks if the provided object has an "isRepost" property that is true,
 * indicating that it is a RepostResponse.
 * 
 * @param {PostResponse | RepostResponse} object - The object to check.
 * @returns {object is RepostResponse} - True if the object is a RepostResponse, otherwise false.
 */
export const isRepost = (object: PostResponse | RepostResponse): object is RepostResponse => {
    return "isRepost" in object && object.isRepost === true;
}