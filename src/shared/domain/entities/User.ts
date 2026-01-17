/**
 * Global User Entity.
 * 
 * Shared user entity used across multiple features.
 * Represents user profile data and basic user information.
 */

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email?: string,
    public readonly bio?: string,
    public readonly avatar?: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly isActive: boolean = true,
    public readonly isVerified: boolean = false
  ) {}

  /**
   * Get display name for user
   */
  getDisplayName(): string {
    return this.username;
  }

  /**
   * Check if user has avatar
   */
  hasAvatar(): boolean {
    return !!this.avatar;
  }

  /**
   * Check if user has bio
   */
  hasBio(): boolean {
    return !!this.bio;
  }

  /**
   * Get user initials for avatar fallback
   */
  getInitials(): string {
    const names = this.username.split(' ');
    return names.map(name => name.charAt(0).toUpperCase()).join('');
  }

  /**
   * Check if user is active
   */
  isUserActive(): boolean {
    return this.isActive;
  }

  /**
   * Check if user is verified
   */
  isUserVerified(): boolean {
    return this.isVerified;
  }

  /**
   * Get user age in days since creation
   */
  getAgeInDays(): number {
    const now = new Date();
    const diff = now.getTime() - this.createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>): User {
    return new User(
      this.id,
      updates.username || this.username,
      updates.email || this.email,
      updates.avatar || this.avatar,
      updates.bio || this.bio,
      updates.createdAt || this.createdAt,
      updates.updatedAt || new Date(),
      updates.isActive ?? this.isActive,
      updates.isVerified ?? this.isVerified
    );
  }

  /**
   * Deactivate user
   */
  deactivate(): User {
    return new User(
      this.id,
      this.username,
      this.email,
      this.avatar,
      this.bio,
      this.createdAt,
      new Date(),
      false,
      this.isVerified
    );
  }

  /**
   * Verify user
   */
  verify(): User {
    return new User(
      this.id,
      this.username,
      this.email,
      this.avatar,
      this.bio,
      this.createdAt,
      new Date(),
      this.isActive,
      true
    );
  }

  /**
   * Convert to JSON for storage
   */
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      avatar: this.avatar,
      bio: this.bio,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      isActive: this.isActive,
      isVerified: this.isVerified
    };
  }

  /**
   * Create User from JSON (from storage)
   */
  static fromJSON(json: Record<string, any>): User {
    return new User(
      json.id,
      json.username,
      json.email,
      json.avatar,
      json.bio,
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.isActive ?? true,
      json.isVerified ?? false
    );
  }
}
