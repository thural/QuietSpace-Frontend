import type { UserProfileEntity } from '@/features/profile/domain/entities';

// User service interface
interface IUserService {
  getCurrentUser(): UserProfileEntity | null;
  setCurrentUser(user: UserProfileEntity): void;
  updateUserProfile(updates: Partial<UserProfileEntity>): Promise<UserProfileEntity>;
  logout(): void;
}

// User repository interface
interface IUserRepository {
  findById(id: string): Promise<UserProfileEntity | null>;
  save(user: UserProfileEntity): Promise<UserProfileEntity>;
  update(id: string, updates: Partial<UserProfileEntity>): Promise<UserProfileEntity>;
  delete(id: string): Promise<void>;
}

// Mock repository implementation
export class UserRepository implements IUserRepository {
  private readonly users = new Map<string, UserProfileEntity>();

  async findById(id: string): Promise<UserProfileEntity | null> {
    return this.users.get(id) || null;
  }

  async save(user: UserProfileEntity): Promise<UserProfileEntity> {
    this.users.set(user.id.toString(), user);
    return user;
  }

  async update(id: string, updates: Partial<UserProfileEntity>): Promise<UserProfileEntity> {
    const existing = this.users.get(id);
    if (!existing) {
      throw new Error(`User ${id} not found`);
    }
    const updated = { ...existing, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  // Helper method to create sample users
  createSampleUser(id: string, username: string): UserProfileEntity {
    return {
      id,
      username,
      email: `${username}@example.com`,
      bio: 'Sample bio',
      photo: {
        type: 'avatar',
        id,
        name: username,
        url: 'avatar.jpg'
      },
      settings: {
        theme: 'light',
        language: 'en',
        notifications: true
      },
      isPrivateAccount: false,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

// User service implementation
export class UserService implements IUserService {
  private currentUser: UserProfileEntity | null = null;

  constructor(private readonly userRepository: IUserRepository) { }

  getCurrentUser(): UserProfileEntity | null {
    return this.currentUser;
  }

  setCurrentUser(user: UserProfileEntity): void {
    this.currentUser = user;
    console.log(`User logged in: ${user.username}`);
  }

  async updateUserProfile(updates: Partial<UserProfileEntity>): Promise<UserProfileEntity> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    const updated = await this.userRepository.update(this.currentUser.id.toString(), updates);
    this.currentUser = updated;

    console.log(`User profile updated: ${JSON.stringify(updates)}`);
    return updated;
  }

  logout(): void {
    if (this.currentUser) {
      console.log(`User logged out: ${this.currentUser.username}`);
      this.currentUser = null;
    }
  }
}
