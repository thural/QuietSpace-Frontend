import { CommentResponse } from "@/api/schemas/inferred/comment";
import { PostResponse, RepostResponse } from "@/api/schemas/inferred/post";
import { UserProfileResponse, UserResponse } from "@/api/schemas/inferred/user";

export const isComment = (object: PostResponse | CommentResponse): object is CommentResponse => {
    return "replyCount" in object;
}

export const isUserProfile = (object: UserResponse | UserProfileResponse): object is UserProfileResponse => {
    return "settings" in object;
}

export const isRepost = (object: PostResponse | RepostResponse): object is RepostResponse => {
    return "isRepost" in object && object.isRepost === true
}