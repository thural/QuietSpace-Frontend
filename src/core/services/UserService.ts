import 'reflect-metadata';
import { Injectable, Inject } from '../di';
import { User } from '../../shared/domain/entities/User';

// User service interface
interface IUserService {
  getCurrentUser(): User | null;
  setCurrentUser(user: User): void;
  updateUserProfile(updates: Partial<User>): Promise<User>;
  logout(): void;
}

// User repository interface
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

// Mock repository implementation
@Injectable({ lifetime: 'singleton' })
export class UserRepository implements IUserRepository {
  private users = new Map<string, User>();

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
      throw new Error(`User ${id} not found`);
    }
    const updated = existing.updateProfile(updates);
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  // Helper method to create sample users
  createSampleUser(id: string, username: string): User {
    return new User(
      id,
      username,
      `${username}@example.com`,
      'Sample bio',
      'avatar.jpg',
      new Date(),
      new Date(),
      true,
      false
    );
  }
}

// User service implementation
@Injectable({ lifetime: 'singleton' })
export class UserService implements IUserService {
  private currentUser: User | null = null;

  constructor(
    @Inject(UserRepository) private userRepository: IUserRepository
  ) {}

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
    console.log(`User logged in: ${user.username}`);
  }

  async updateUserProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }
    
    const updated = await this.userRepository.update(this.currentUser.id, updates);
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
