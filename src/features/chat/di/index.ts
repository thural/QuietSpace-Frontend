/**
 * Chat DI Barrel Export.
 * 
 * Exports all DI-related components for Chat feature.
 */

// DI Container
export { ChatDIContainer, type DIContainerConfig } from './ChatDIContainer';

// DI Configuration
export { 
    developmentConfig, 
    productionConfig, 
    testConfig, 
    getChatConfig 
} from './ChatDIConfig';

// DI Hooks
export { 
    useChatDI, 
    useChatRepository, 
    useChatService,
    type UseChatDIConfig 
} from './useChatDI';
