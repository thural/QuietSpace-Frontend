import 'reflect-metadata';
import * as React from 'react';
import { Injectable, Inject, useService } from '../../../../core/di';
import { User } from '../../../../shared/domain/entities/User';

// Profile service interfaces
interface IProfileService {
  getProfile(userId: string): Promise<User | null>;
  updateProfile(userId: string, updates: Partial<User>): Promise<User>;
  followUser(userId: string, targetUserId: string): Promise<void>;
  unfollowUser(userId: string, targetUserId: string): Promise<void>;
  getFollowers(userId: string): Promise<User[]>;
  getFollowing(userId: string): Promise<User[]>;
  getProfileStats(userId: string): Promise<ProfileStats>;
}

interface IProfileRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  findFollowers(userId: string): Promise<User[]>;
  findFollowing(userId: string): Promise<User[]>;
  getStats(userId: string): Promise<ProfileStats>;
}

interface ProfileStats {
  followersCount: number;
  followingCount: number;
  postsCount: number;
  engagementRate: number;
  profileStrength: number;
}

// Mock profile repository
@Injectable({ lifetime: 'singleton' })
export class ProfileRepository implements IProfileRepository {
  private users = new Map<string, User>();
  private followers = new Map<string, Set<string>>();
  private following = new Map<string, Set<string>>();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const existing = this.users.get(id);
    if (!existing) {
      throw new Error(`Profile ${id} not found`);
    }
    const updated = existing.updateProfile(updates);
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  async findFollowers(userId: string): Promise<User[]> {
    const followerIds = this.followers.get(userId) || new Set();
    return Array.from(followerIds)
      .map(id => this.users.get(id))
      .filter((user): user is User => user !== undefined);
  }

  async findFollowing(userId: string): Promise<User[]> {
    const followingIds = this.following.get(userId) || new Set();
    return Array.from(followingIds)
      .map(id => this.users.get(id))
      .filter((user): user is User => user !== undefined);
  }

  async getStats(userId: string): Promise<ProfileStats> {
    const followersCount = (this.followers.get(userId) || new Set()).size;
    const followingCount = (this.following.get(userId) || new Set()).size;
    const postsCount = Math.floor(Math.random() * 1000); // Mock data
    const engagementRate = followersCount > 0 ? (Math.random() * 10) : 0;
    const profileStrength = Math.random() * 100;

    return {
      followersCount,
      followingCount,
      postsCount,
      engagementRate,
      profileStrength
    };
  }

  // Helper methods for following relationships
  addFollower(userId: string, followerId: string): void {
    if (!this.followers.has(userId)) {
      this.followers.set(userId, new Set());
    }
    this.followers.get(userId)!.add(followerId);
  }

  removeFollower(userId: string, followerId: string): void {
    this.followers.get(userId)?.delete(followerId);
  }

  addFollowing(userId: string, followingId: string): void {
    if (!this.following.has(userId)) {
      this.following.set(userId, new Set());
    }
    this.following.get(userId)!.add(followingId);
  }

  removeFollowing(userId: string, followingId: string): void {
    this.following.get(userId)?.delete(followingId);
  }
}

// DI-enabled Profile Service
@Injectable({ lifetime: 'singleton' })
export class ProfileService implements IProfileService {
  constructor(
    @Inject(ProfileRepository) private profileRepository: IProfileRepository
  ) {}

  async getProfile(userId: string): Promise<User | null> {
    return await this.profileRepository.findById(userId);
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    return await this.profileRepository.update(userId, updates);
  }

  async followUser(userId: string, targetUserId: string): Promise<void> {
    // In a real app, this would use a relationship service
    const profileRepo = this.profileRepository as ProfileRepository;
    profileRepo.addFollowing(userId, targetUserId);
    profileRepo.addFollower(targetUserId, userId);
  }

  async unfollowUser(userId: string, targetUserId: string): Promise<void> {
    const profileRepo = this.profileRepository as ProfileRepository;
    profileRepo.removeFollowing(userId, targetUserId);
    profileRepo.removeFollower(targetUserId, userId);
  }

  async getFollowers(userId: string): Promise<User[]> {
    return await this.profileRepository.findFollowers(userId);
  }

  async getFollowing(userId: string): Promise<User[]> {
    return await this.profileRepository.findFollowing(userId);
  }

  async getProfileStats(userId: string): Promise<ProfileStats> {
    return await this.profileRepository.getStats(userId);
  }
}

// DI-enabled Profile Hook
export const useProfileDI = (userId?: string) => {
  const profileService = useService(ProfileService);
  const [profile, setProfile] = React.useState<User | null>(null);
  const [followers, setFollowers] = React.useState<User[]>([]);
  const [following, setFollowing] = React.useState<User[]>([]);
  const [stats, setStats] = React.useState<ProfileStats | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchProfile = React.useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const profileData = await profileService.getProfile(id);
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [profileService]);

  const updateProfileData = React.useCallback(async (updates: Partial<User>) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await profileService.updateProfile(userId, updates);
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }, [profileService, userId]);

  const followUser = React.useCallback(async (targetUserId: string) => {
    if (!userId) return;
    
    try {
      await profileService.followUser(userId, targetUserId);
      // Refresh following list
      await fetchFollowing();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to follow user');
    }
  }, [profileService, userId]);

  const unfollowUser = React.useCallback(async (targetUserId: string) => {
    if (!userId) return;
    
    try {
      await profileService.unfollowUser(userId, targetUserId);
      // Refresh following list
      await fetchFollowing();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unfollow user');
    }
  }, [profileService, userId]);

  const fetchFollowers = React.useCallback(async () => {
    if (!userId) return;
    
    try {
      const followersData = await profileService.getFollowers(userId);
      setFollowers(followersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch followers');
    }
  }, [profileService, userId]);

  const fetchFollowing = React.useCallback(async () => {
    if (!userId) return;
    
    try {
      const followingData = await profileService.getFollowing(userId);
      setFollowing(followingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch following');
    }
  }, [profileService, userId]);

  const fetchStats = React.useCallback(async () => {
    if (!userId) return;
    
    try {
      const statsData = await profileService.getProfileStats(userId);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile stats');
    }
  }, [profileService, userId]);

  // Auto-fetch data when userId changes
  React.useEffect(() => {
    if (userId) {
      fetchProfile(userId);
      fetchFollowers();
      fetchFollowing();
      fetchStats();
    }
  }, [userId, fetchProfile, fetchFollowers, fetchFollowing, fetchStats]);

  return {
    profile,
    followers,
    following,
    stats,
    loading,
    error,
    fetchProfile,
    updateProfileData,
    followUser,
    unfollowUser,
    fetchFollowers,
    fetchFollowing,
    fetchStats
  };
};
