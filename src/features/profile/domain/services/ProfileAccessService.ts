import type { ProfileAccessEntity, UserProfileEntity } from "../entities";
import { canAccessProfile, createProfileAccess, getAccessDeniedReason } from "../profileLogic";

export const ProfileAccessService = {
  canAccess(access: ProfileAccessEntity): boolean {
    return canAccessProfile(access);
  },

  getDeniedReason(access: ProfileAccessEntity): string {
    return getAccessDeniedReason(access);
  },

  create(profile: UserProfileEntity, viewerId: string | number, isFollowing: boolean): ProfileAccessEntity {
    return createProfileAccess(profile, viewerId, isFollowing);
  }
};
