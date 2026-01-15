import type { UserProfileEntity, UserConnectionEntity, UserProfileStatsEntity } from "../../domain";

export const mapApiUserToUserProfileEntity = (user: any): UserProfileEntity => {
  const photo = user?.photo
    ? {
        type: user.photo.type || "avatar",
        id: user.photo.id || "default",
        name: user.photo.name || "User Photo",
        url: user.photo.data || ""
      }
    : {
        type: "avatar",
        id: "default",
        name: "Default Avatar",
        url: ""
      };

  return {
    id: user?.id ?? "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio,
    photo,
    settings: {
      theme: "light",
      language: "en",
      notifications: true
    },
    isPrivateAccount: user?.isPrivateAccount || false,
    isVerified: user?.role === "VERIFIED",
    createdAt: user?.createDate || "",
    updatedAt: user?.updateDate || ""
  };
};

export const mapApiUserToConnectionEntity = (user: any): UserConnectionEntity => {
  const photo = user?.photo
    ? {
        type: user.photo.type || "avatar",
        id: user.photo.id || "default",
        name: user.photo.name || "User Photo",
        url: user.photo.data || ""
      }
    : undefined;

  return {
    id: user?.id ?? "",
    username: user?.username || "",
    bio: user?.bio,
    photo,
    isFollowing: true,
    isMutual: false,
    connectedAt: new Date().toISOString()
  };
};

export const createStatsEntity = (input: {
  postsCount: number;
  followersCount: number;
  followingsCount: number;
}): UserProfileStatsEntity => {
  return {
    postsCount: input.postsCount,
    followersCount: input.followersCount,
    followingsCount: input.followingsCount,
    likesCount: 0,
    sharesCount: 0,
    commentsCount: 0
  };
};
