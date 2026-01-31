// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('../features/profile/domain/entities/UserProfileEntity.js').UserProfileEntity} UserProfileEntity
 */

// User service interface
/**
 * User service interface
 * 
 * @interface IUserService
 * @description Defines contract for user service operations
 */
export class IUserService {
    /**
     * Gets current user
     * 
     * @returns {UserProfileEntity|null} Current user or null
     * @description Gets the currently authenticated user
     */
    getCurrentUser() {
        throw new Error('Method getCurrentUser() must be implemented');
    }

    /**
     * Sets current user
     * 
     * @param {UserProfileEntity} user - User to set as current
     * @returns {void}
     * @description Sets the currently authenticated user
     */
    setCurrentUser(user) {
        throw new Error('Method setCurrentUser() must be implemented');
    }

    /**
     * Updates user profile
     * 
     * @param {Object} updates - Profile updates
     * @returns {Promise<UserProfileEntity>} Updated user profile
     * @description Updates the current user's profile
     */
    updateUserProfile(updates) {
        throw new Error('Method updateUserProfile() must be implemented');
    }

    /**
     * Logs out user
     * 
     * @returns {void}
     * @description Logs out the current user
     */
    logout() {
        throw new Error('Method logout() must be implemented');
    }
}

// User repository interface
/**
 * User repository interface
 * 
 * @interface IUserRepository
 * @description Defines contract for user data operations
 */
export class IUserRepository {
    /**
     * Find user by ID
     * 
     * @param {string} id - User ID
     * @returns {Promise<UserProfileEntity|null>} User or null
     * @description Finds a user by their ID
     */
    async findById(id) {
        throw new Error('Method findById() must be implemented');
    }

    /**
     * Save user
     * 
     * @param {UserProfileEntity} user - User to save
     * @returns {Promise<UserProfileEntity>} Saved user
     * @description Saves a user to the repository
     */
    async save(user) {
        throw new Error('Method save() must be implemented');
    }

    /**
     * Update user
     * 
     * @param {string} id - User ID
     * @param {Object} updates - User updates
     * @returns {Promise<UserProfileEntity>} Updated user
     * @description Updates a user in the repository
     */
    async update(id, updates) {
        throw new Error('Method update() must be implemented');
    }

    /**
     * Delete user
     * 
     * @param {string} id - User ID
     * @returns {Promise<void>}
     * @description Deletes a user from the repository
     */
    async delete(id) {
        throw new Error('Method delete() must be implemented');
    }
}

// Mock repository implementation
/**
 * User repository mock implementation
 * 
 * @class UserRepository
 * @extends {IUserRepository}
 * @description In-memory user repository for testing and development
 */
export class UserRepository extends IUserRepository {
    /**
     * Users storage
     * 
     * @type {Map<string, UserProfileEntity>}
     */
    users;

    /**
     * Create user repository
     * 
     * @description Creates a new user repository instance
     */
    constructor() {
        super();
        this.users = new Map();
    }

    /**
     * Find user by ID
     * 
     * @param {string} id - User ID
     * @returns {Promise<UserProfileEntity|null>} User or null
     * @description Finds a user by their ID
     */
    async findById(id) {
        return this.users.get(id) || null;
    }

    /**
     * Save user
     * 
     * @param {UserProfileEntity} user - User to save
     * @returns {Promise<UserProfileEntity>} Saved user
     * @description Saves a user to the repository
     */
    async save(user) {
        this.users.set(user.id.toString(), user);
        return user;
    }

    /**
     * Update user
     * 
     * @param {string} id - User ID
     * @param {Object} updates - User updates
     * @returns {Promise<UserProfileEntity>} Updated user
     * @description Updates a user in the repository
     */
    async update(id, updates) {
        const existing = this.users.get(id);
        if (!existing) {
            throw new Error(`User ${id} not found`);
        }
        const updated = { ...existing, ...updates };
        this.users.set(id, updated);
        return updated;
    }

    /**
     * Delete user
     * 
     * @param {string} id - User ID
     * @returns {Promise<void>}
     * @description Deletes a user from the repository
     */
    async delete(id) {
        this.users.delete(id);
    }

    /**
     * Helper method to create sample users
     * 
     * @param {string} id - User ID
     * @param {string} username - Username
     * @param {Object} [additionalData] - Additional user data
     * @returns {UserProfileEntity} Sample user
     * @description Creates a sample user for testing
     */
    createSampleUser(id, username, additionalData = {}) {
        return {
            id,
            username,
            email: `${username.toLowerCase()}@example.com`,
            displayName: username.charAt(0).toUpperCase() + username.slice(1),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            bio: `Bio for ${username}`,
            location: 'Unknown',
            website: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
            roles: ['user'],
            preferences: {
                theme: 'light',
                language: 'en',
                notifications: true
            },
            ...additionalData
        };
    }

    /**
     * Find user by username
     * 
     * @param {string} username - Username to search
     * @returns {Promise<UserProfileEntity|null>} User or null
     * @description Finds a user by username
     */
    async findByUsername(username) {
        for (const user of this.users.values()) {
            if (user.username === username) {
                return user;
            }
        }
        return null;
    }

    /**
     * Find user by email
     * 
     * @param {string} email - Email to search
     * @returns {Promise<UserProfileEntity|null>} User or null
     * @description Finds a user by email
     */
    async findByEmail(email) {
        for (const user of this.users.values()) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }

    /**
     * Get all users
     * 
     * @returns {Promise<UserProfileEntity[]>} All users
     * @description Gets all users in the repository
     */
    async findAll() {
        return Array.from(this.users.values());
    }

    /**
     * Count users
     * 
     * @returns {Promise<number>} Number of users
     * @description Gets the total number of users
     */
    async count() {
        return this.users.size;
    }

    /**
     * Clear all users
     * 
     * @returns {Promise<void>}
     * @description Clears all users from the repository
     */
    async clear() {
        this.users.clear();
    }

    /**
     * Seed with sample data
     * 
     * @param {number} [count] - Number of sample users to create
     * @returns {Promise<void>}
     * @description Seeds the repository with sample users
     */
    async seedWithSampleData(count = 5) {
        const sampleUsers = [
            { id: '1', username: 'john_doe', displayName: 'John Doe' },
            { id: '2', username: 'jane_smith', displayName: 'Jane Smith' },
            { id: '3', username: 'bob_wilson', displayName: 'Bob Wilson' },
            { id: '4', username: 'alice_brown', displayName: 'Alice Brown' },
            { id: '5', username: 'charlie_davis', displayName: 'Charlie Davis' }
        ];

        for (let i = 0; i < Math.min(count, sampleUsers.length); i++) {
            const userData = sampleUsers[i];
            const user = this.createSampleUser(userData.id, userData.username, {
                displayName: userData.displayName
            });
            await this.save(user);
        }
    }
}

// User service implementation
/**
 * User service implementation
 * 
 * @class UserService
 * @extends {IUserService}
 * @description Provides user management functionality
 */
export class UserService extends IUserService {
    /**
     * User repository
     * 
     * @type {IUserRepository}
     */
    repository;

    /**
     * Current user
     * 
     * @type {UserProfileEntity|null}
     */
    currentUser;

    /**
     * Create user service
     * 
     * @param {IUserRepository} [repository] - User repository
     * @description Creates a new user service instance
     */
    constructor(repository = new UserRepository()) {
        super();
        this.repository = repository;
        this.currentUser = null;
    }

    /**
     * Gets current user
     * 
     * @returns {UserProfileEntity|null} Current user or null
     * @description Gets the currently authenticated user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Sets current user
     * 
     * @param {UserProfileEntity} user - User to set as current
     * @returns {void}
     * @description Sets the currently authenticated user
     */
    setCurrentUser(user) {
        this.currentUser = user;
    }

    /**
     * Updates user profile
     * 
     * @param {Object} updates - Profile updates
     * @returns {Promise<UserProfileEntity>} Updated user profile
     * @description Updates the current user's profile
     */
    async updateUserProfile(updates) {
        if (!this.currentUser) {
            throw new Error('No current user to update');
        }

        const updatedUser = await this.repository.update(
            this.currentUser.id.toString(),
            {
                ...updates,
                updatedAt: new Date().toISOString()
            }
        );

        this.currentUser = updatedUser;
        return updatedUser;
    }

    /**
     * Logs out user
     * 
     * @returns {void}
     * @description Logs out the current user
     */
    logout() {
        this.currentUser = null;
    }

    /**
     * Login user by credentials
     * 
     * @param {string} username - Username
     * @param {string} password - Password (mock)
     * @returns {Promise<UserProfileEntity|null>} User or null
     * @description Logs in a user by username and password
     */
    async login(username, password) {
        // Mock authentication - in real implementation, validate password
        const user = await this.repository.findByUsername(username);
        if (user && user.isActive) {
            this.setCurrentUser(user);
            return user;
        }
        return null;
    }

    /**
     * Register new user
     * 
     * @param {Object} userData - User registration data
     * @param {string} userData.username - Username
     * @param {string} userData.email - Email
     * @param {string} userData.password - Password (mock)
     * @returns {Promise<UserProfileEntity>} Registered user
     * @description Registers a new user
     */
    async register(userData) {
        // Check if username already exists
        const existingUser = await this.repository.findByUsername(userData.username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Check if email already exists
        const existingEmail = await this.repository.findByEmail(userData.email);
        if (existingEmail) {
            throw new Error('Email already exists');
        }

        // Create new user
        const newUser = this.repository.createSampleUser(
            Date.now().toString(),
            userData.username,
            {
                email: userData.email,
                displayName: userData.displayName || userData.username,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );

        const savedUser = await this.repository.save(newUser);
        this.setCurrentUser(savedUser);
        return savedUser;
    }

    /**
     * Get user by ID
     * 
     * @param {string} id - User ID
     * @returns {Promise<UserProfileEntity|null>} User or null
     * @description Gets a user by ID
     */
    async getUserById(id) {
        return await this.repository.findById(id);
    }

    /**
     * Search users
     * 
     * @param {string} query - Search query
     * @returns {Promise<UserProfileEntity[]>} Matching users
     * @description Searches users by username or display name
     */
    async searchUsers(query) {
        const allUsers = await this.repository.findAll();
        const lowerQuery = query.toLowerCase();
        
        return allUsers.filter(user => 
            user.username.toLowerCase().includes(lowerQuery) ||
            user.displayName.toLowerCase().includes(lowerQuery)
        );
    }
}
