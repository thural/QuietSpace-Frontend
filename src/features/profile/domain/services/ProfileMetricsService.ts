import type { UserProfileEntity, UserProfileStatsEntity } from "../entities";
import {
  calculateEngagementRate,
  getProfileCompletion,
  getProfileStrength,
  hasCompleteProfile
} from "../profileLogic";

export const ProfileMetricsService = {
  getCompletion(profile: UserProfileEntity): number {
    return getProfileCompletion(profile);
  },

  hasCompleteProfile(profile: UserProfileEntity): boolean {
    return hasCompleteProfile(profile);
  },

  getEngagementRate(stats: UserProfileStatsEntity): number {
    return calculateEngagementRate(stats);
  },

  getStrength(profile: UserProfileEntity, stats: UserProfileStatsEntity): number {
    return getProfileStrength(profile, stats);
  }
};
