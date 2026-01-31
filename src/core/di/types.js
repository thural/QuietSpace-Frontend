/**
 * Dependency Injection Types.
 * 
 * Defines all DI container types and tokens for the application.
 */

export const TYPES = Object.freeze({
  // Core Services
  API_CLIENT: 'ApiClient',
  REST_CLIENT: 'RestClient',
  SOCKET_SERVICE: 'SocketService',
  TOKEN_SERVICE: 'TokenService',
  AUTHENTICATED_API_SERVICE: 'AuthenticatedApiService',
  USER_SERVICE: 'UserService',
  LOGGER_SERVICE: 'LoggerService',
  THEME_SERVICE: 'ThemeService',

  // Repositories
  IAUTH_REPOSITORY: 'IAuthRepository',
  AUTH_REPOSITORY: 'AuthRepository',
  CHAT_REPOSITORY: 'ChatRepository',
  MESSAGE_REPOSITORY: 'MessageRepository',
  POST_REPOSITORY: 'PostRepository',
  IPOST_REPOSITORY: 'IPostRepository',
  COMMENT_REPOSITORY: 'CommentRepository',
  ICOMMENT_REPOSITORY: 'ICommentRepository',
  IFEED_REPOSITORY: 'IFeedRepository',
  NOTIFICATION_REPOSITORY: 'NotificationRepository',
  USER_REPOSITORY: 'UserRepository',
  PROFILE_REPOSITORY: 'ProfileRepository',
  SEARCH_REPOSITORY: 'SearchRepository',

  // Data Services
  AUTH_DATA_SERVICE: 'AuthDataService',
  NOTIFICATION_DATA_SERVICE: 'NotificationDataService',
  ANALYTICS_DATA_SERVICE: 'AnalyticsDataService',
  POST_DATA_SERVICE: 'PostDataService',
  COMMENT_DATA_SERVICE: 'CommentDataService',
  FEED_DATA_SERVICE: 'FeedDataService',
  PROFILE_DATA_SERVICE: 'ProfileDataService',
  SEARCH_DATA_SERVICE: 'SearchDataService',
  CHAT_DATA_SERVICE: 'ChatDataService',
  CONTENT_DATA_SERVICE: 'ContentDataService',
  NAVBAR_DATA_SERVICE: 'NavbarDataService',
  SETTINGS_DATA_SERVICE: 'SettingsDataService',

  // Feature Services
  AUTH_FEATURE_SERVICE: 'AuthFeatureService',
  NOTIFICATION_FEATURE_SERVICE: 'NotificationFeatureService',
  ANALYTICS_FEATURE_SERVICE: 'AnalyticsFeatureService',
  FEED_FEATURE_SERVICE: 'FeedFeatureService',
  POST_FEATURE_SERVICE: 'PostFeatureService',
  PROFILE_FEATURE_SERVICE: 'ProfileFeatureService',
  SEARCH_FEATURE_SERVICE: 'SearchFeatureService',

  // Chat Feature Services
  CHAT_FEATURE_SERVICE: 'ChatFeatureService',
  WEBSOCKET_SERVICE: 'WebSocketService',
  ICHAT_REPOSITORY: 'IChatRepository',

  // WebSocket Enterprise Services
  ENTERPRISE_WEBSOCKET_SERVICE: 'EnterpriseWebSocketService',
  CONNECTION_MANAGER: 'ConnectionManager',
  MESSAGE_ROUTER: 'MessageRouter',
  WEBSOCKET_CONTAINER: 'WebSocketContainer',

  // Notification Feature Services
  PUSH_NOTIFICATION_SERVICE: 'PushNotificationService',

  // Configurations
  POST_DATA_SERVICE_CONFIG: 'PostDataServiceConfig',
  COMMENT_DATA_SERVICE_CONFIG: 'CommentDataServiceConfig',
  FEED_DATA_SERVICE_CONFIG: 'FeedDataServiceConfig',

  // Core Services
  AUTH_SERVICE: 'AuthService',
  CACHE_SERVICE: 'CacheService',

  // Containers
  AUTH_CONTAINER: 'AuthContainer',
  NOTIFICATION_CONTAINER: 'NotificationContainer',
  ANALYTICS_CONTAINER: 'AnalyticsContainer',
  FEED_CONTAINER: 'FeedContainer',
  PROFILE_CONTAINER: 'ProfileContainer',
  SEARCH_CONTAINER: 'SearchContainer',

  // Stores
  AUTH_STORE: 'AuthStore',
  FEED_STORE: 'FeedStore'
});

/**
 * TypeKeys type definition
 * 
 * @typedef {keyof typeof TYPES} TypeKeys
 */

/**
 * Validates if a value is a valid DI token
 * 
 * @function isValidDIToken
 * @param {string} token - Token to validate
 * @returns {boolean} Whether token is valid
 * @description Validates if a value is a valid DI token
 */
export function isValidDIToken(token) {
    const tokens = /** @type {Record<string, string>} */ (TYPES);
    return Object.values(tokens).includes(token);
}

/**
 * Gets DI token by key
 * 
 * @function getDIToken
 * @param {string} key - Token key
 * @returns {string|undefined} DI token value
 * @description Gets DI token value by key
 */
export function getDIToken(key) {
    return /** @type {Record<string, string>} */ (TYPES)[key];
}

/**
 * Gets all DI tokens
 * 
 * @function getAllDITokens
 * @returns {Record<string, string>} All DI tokens
 * @description Returns all DI tokens as key-value pairs
 */
export function getAllDITokens() {
    return /** @type {Record<string, string>} */ (TYPES);
}

/**
 * Creates a DI token validation function
 * 
 * @function createDITokenValidator
 * @param {string[]} allowedTokens - Allowed tokens
 * @returns {Function} Token validation function
 * @description Creates a function to validate against allowed tokens
 */
export function createDITokenValidator(allowedTokens) {
    return function(token) {
        return allowedTokens.includes(token);
    };
}

/**
 * Gets DI token category
 * 
 * @function getDITokenCategory
 * @param {string} token - DI token
 * @returns {string} Token category
 * @description Gets the category of a DI token
 */
export function getDITokenCategory(token) {
    const categories = {
        'Core Services': [
            TYPES.API_CLIENT, TYPES.REST_CLIENT, TYPES.SOCKET_SERVICE,
            TYPES.TOKEN_SERVICE, TYPES.AUTHENTICATED_API_SERVICE, TYPES.USER_SERVICE,
            TYPES.LOGGER_SERVICE, TYPES.THEME_SERVICE
        ],
        'Repositories': [
            TYPES.IAUTH_REPOSITORY, TYPES.AUTH_REPOSITORY, TYPES.CHAT_REPOSITORY,
            TYPES.MESSAGE_REPOSITORY, TYPES.POST_REPOSITORY, TYPES.IPOST_REPOSITORY,
            TYPES.COMMENT_REPOSITORY, TYPES.ICOMMENT_REPOSITORY, TYPES.IFEED_REPOSITORY,
            TYPES.NOTIFICATION_REPOSITORY, TYPES.USER_REPOSITORY, TYPES.PROFILE_REPOSITORY,
            TYPES.SEARCH_REPOSITORY
        ],
        'Data Services': [
            TYPES.AUTH_DATA_SERVICE, TYPES.NOTIFICATION_DATA_SERVICE,
            TYPES.ANALYTICS_DATA_SERVICE, TYPES.POST_DATA_SERVICE,
            TYPES.COMMENT_DATA_SERVICE, TYPES.FEED_DATA_SERVICE,
            TYPES.PROFILE_DATA_SERVICE, TYPES.SEARCH_DATA_SERVICE,
            TYPES.CHAT_DATA_SERVICE, TYPES.CONTENT_DATA_SERVICE,
            TYPES.NAVBAR_DATA_SERVICE, TYPES.SETTINGS_DATA_SERVICE
        ],
        'Feature Services': [
            TYPES.AUTH_FEATURE_SERVICE, TYPES.NOTIFICATION_FEATURE_SERVICE,
            TYPES.ANALYTICS_FEATURE_SERVICE, TYPES.FEED_FEATURE_SERVICE,
            TYPES.POST_FEATURE_SERVICE, TYPES.PROFILE_FEATURE_SERVICE,
            TYPES.SEARCH_FEATURE_SERVICE, TYPES.CHAT_FEATURE_SERVICE,
            TYPES.WEBSOCKET_SERVICE, TYPES.ICHAT_REPOSITORY
        ],
        'WebSocket Services': [
            TYPES.ENTERPRISE_WEBSOCKET_SERVICE, TYPES.CONNECTION_MANAGER,
            TYPES.MESSAGE_ROUTER, TYPES.WEBSOCKET_CONTAINER
        ],
        'Notification Services': [
            TYPES.PUSH_NOTIFICATION_SERVICE
        ],
        'Configurations': [
            TYPES.POST_DATA_SERVICE_CONFIG, TYPES.COMMENT_DATA_SERVICE_CONFIG,
            TYPES.FEED_DATA_SERVICE_CONFIG
        ],
        'Core DI Services': [
            TYPES.AUTH_SERVICE, TYPES.CACHE_SERVICE
        ],
        'Containers': [
            TYPES.AUTH_CONTAINER, TYPES.NOTIFICATION_CONTAINER,
            TYPES.ANALYTICS_CONTAINER, TYPES.FEED_CONTAINER,
            TYPES.PROFILE_CONTAINER, TYPES.SEARCH_CONTAINER
        ],
        'Stores': [
            TYPES.AUTH_STORE, TYPES.FEED_STORE
        ]
    };

    for (const [category, tokens] of Object.entries(categories)) {
        if (tokens.includes(token)) {
            return category;
        }
    }

    return 'Unknown';
}

/**
 * Gets DI tokens by category
 * 
 * @function getDITokensByCategory
 * @param {string} category - Category name
 * @returns {string[]} Array of tokens in category
 * @description Gets all DI tokens in a specific category
 */
export function getDITokensByCategory(category) {
    const categories = {
        'Core Services': [
            TYPES.API_CLIENT, TYPES.REST_CLIENT, TYPES.SOCKET_SERVICE,
            TYPES.TOKEN_SERVICE, TYPES.AUTHENTICATED_API_SERVICE, TYPES.USER_SERVICE,
            TYPES.LOGGER_SERVICE, TYPES.THEME_SERVICE
        ],
        'Repositories': [
            TYPES.IAUTH_REPOSITORY, TYPES.AUTH_REPOSITORY, TYPES.CHAT_REPOSITORY,
            TYPES.MESSAGE_REPOSITORY, TYPES.POST_REPOSITORY, TYPES.IPOST_REPOSITORY,
            TYPES.COMMENT_REPOSITORY, TYPES.ICOMMENT_REPOSITORY, TYPES.IFEED_REPOSITORY,
            TYPES.NOTIFICATION_REPOSITORY, TYPES.USER_REPOSITORY, TYPES.PROFILE_REPOSITORY,
            TYPES.SEARCH_REPOSITORY
        ],
        'Data Services': [
            TYPES.AUTH_DATA_SERVICE, TYPES.NOTIFICATION_DATA_SERVICE,
            TYPES.ANALYTICS_DATA_SERVICE, TYPES.POST_DATA_SERVICE,
            TYPES.COMMENT_DATA_SERVICE, TYPES.FEED_DATA_SERVICE,
            TYPES.PROFILE_DATA_SERVICE, TYPES.SEARCH_DATA_SERVICE,
            TYPES.CHAT_DATA_SERVICE, TYPES.CONTENT_DATA_SERVICE,
            TYPES.NAVBAR_DATA_SERVICE, TYPES.SETTINGS_DATA_SERVICE
        ],
        'Feature Services': [
            TYPES.AUTH_FEATURE_SERVICE, TYPES.NOTIFICATION_FEATURE_SERVICE,
            TYPES.ANALYTICS_FEATURE_SERVICE, TYPES.FEED_FEATURE_SERVICE,
            TYPES.POST_FEATURE_SERVICE, TYPES.PROFILE_FEATURE_SERVICE,
            TYPES.SEARCH_FEATURE_SERVICE, TYPES.CHAT_FEATURE_SERVICE,
            TYPES.WEBSOCKET_SERVICE, TYPES.ICHAT_REPOSITORY
        ],
        'WebSocket Services': [
            TYPES.ENTERPRISE_WEBSOCKET_SERVICE, TYPES.CONNECTION_MANAGER,
            TYPES.MESSAGE_ROUTER, TYPES.WEBSOCKET_CONTAINER
        ],
        'Notification Services': [
            TYPES.PUSH_NOTIFICATION_SERVICE
        ],
        'Configurations': [
            TYPES.POST_DATA_SERVICE_CONFIG, TYPES.COMMENT_DATA_SERVICE_CONFIG,
            TYPES.FEED_DATA_SERVICE_CONFIG
        ],
        'Core DI Services': [
            TYPES.AUTH_SERVICE, TYPES.CACHE_SERVICE
        ],
        'Containers': [
            TYPES.AUTH_CONTAINER, TYPES.NOTIFICATION_CONTAINER,
            TYPES.ANALYTICS_CONTAINER, TYPES.FEED_CONTAINER,
            TYPES.PROFILE_CONTAINER, TYPES.SEARCH_CONTAINER
        ],
        'Stores': [
            TYPES.AUTH_STORE, TYPES.FEED_STORE
        ]
    };

    return categories[category] || [];
}
