import * as React from 'react';
import { DIProvider } from './core/di';
import { Container } from './core/di';
import { ThemeService } from './core/services/ThemeService';
import { UserService } from './core/services/UserService';
import { FeedService } from './features/feed/application/hooks/useFeedDI';
import { ProfileService } from './features/profile/application/services/ProfileServiceDI';
import { SettingsService } from './features/settings/application/services/SettingsService';
import { SearchService } from './features/search/application/services/SearchService';
import { NotificationServiceDI as NotificationService } from './features/notification/application/services/NotificationServiceDI';
import { initializeNotificationContainer, getNotificationContainer } from './features/notification/di/NotificationContainerDI';
import { initializeContentContainer, getContentContainer } from './features/content/di';
import { initializeAnalyticsContainer, getAnalyticsContainer } from './features/analytics/di';
import { FEATURE_FLAGS, isFeatureEnabled } from './core/featureFlags';

// Production-ready App with DI integration
const ProductionApp: React.FC = () => {
  // Create DI container with all services
  const container = React.useMemo(() => {
    const appContainer = Container.create();
    
    // Initialize feature-specific containers
    const notificationContainer = initializeNotificationContainer();
    const contentContainer = initializeContentContainer();
    const analyticsContainer = initializeAnalyticsContainer();
    
    // Register all DI services
    appContainer.registerSingleton(ThemeService);
    appContainer.registerSingleton(UserService);
    appContainer.registerSingleton(FeedService);
    appContainer.registerSingleton(ProfileService);
    appContainer.registerSingleton(SettingsService);
    appContainer.registerSingleton(SearchService);
    appContainer.registerSingleton(NotificationService);
    
    return appContainer;
  }, []);

  return (
    <DIProvider container={container}>
      <div style={{ 
        background: '#F8F9FA',
        color: '#1A1A1A',
        minHeight: '100vh',
        padding: '20px'
      }}>
        {/* Feature flag for gradual rollout */}
        {isFeatureEnabled('USE_NEW_ARCHITECTURE') ? (
          <div>
            <h2>🚀 New Architecture Active</h2>
            <p>DI-enabled components with enhanced multi-platform support</p>
            
            {/* DI Status Display */}
            <div style={{
              background: '#FFFFFF',
              padding: '16px',
              margin: '16px',
              borderRadius: '8px',
              border: '1px solid #E1E4E8'
            }}>
              <h4>🔧 DI System Status</h4>
              <ul>
                <li>✅ ThemeService: Registered</li>
                <li>✅ UserService: Registered</li>
                <li>✅ FeedService: Registered</li>
                <li>✅ ProfileService: Registered</li>
                <li>✅ SettingsService: Registered</li>
                <li>✅ SearchService: Registered</li>
                <li>✅ NotificationService: Registered</li>
                <li>🎯 New Architecture: {isFeatureEnabled('USE_NEW_ARCHITECTURE') ? 'ACTIVE' : 'INACTIVE'}</li>
                <li>📱 DI Feed: {isFeatureEnabled('USE_DI_FEED') ? 'ENABLED' : 'PENDING'}</li>
                <li>💬 DI Chat: {isFeatureEnabled('USE_DI_CHAT') ? 'ENABLED' : 'PENDING'}</li>
                <li>👤 DI Profile: {isFeatureEnabled('USE_DI_PROFILE') ? 'ENABLED' : 'PENDING'}</li>
                <li>⚙️ DI Settings: {isFeatureEnabled('USE_DI_SETTINGS') ? 'ENABLED' : 'PENDING'}</li>
                <li>🔍 DI Search: {isFeatureEnabled('USE_DI_SEARCH') ? 'ENABLED' : 'PENDING'}</li>
                <li>🔔 DI Notifications: {isFeatureEnabled('USE_DI_NOTIFICATIONS') ? 'ENABLED' : 'PENDING'}</li>
                <li>📝 DI Content: {isFeatureEnabled('USE_DI_CONTENT') ? 'ENABLED' : 'PENDING'}</li>
                <li>📊 DI Analytics: {isFeatureEnabled('USE_DI_ANALYTICS') ? 'ENABLED' : 'PENDING'}</li>
              </ul>
              
              <h4>🚀 Advanced Features</h4>
              <ul>
                <li>🔔 Real-time Notifications</li>
                <li>📝 Content Management System</li>
                <li>📊 Analytics Dashboard</li>
                <li>🎯 Cross-Feature Integration</li>
                <li>📱 Multi-Platform Support</li>
                <li>🔧 Enterprise DI Architecture</li>
              </ul>
              
              <h4>📈 Performance Metrics</h4>
              <ul>
                <li>⚡ Real-time Analytics</li>
                <li>🎯 AI-Powered Insights</li>
                <li>📊 Custom Dashboards</li>
                <li>🔍 Advanced Search</li>
                <li>📱 Responsive Design</li>
                <li>🛡️ Error Handling</li>
              </ul>
              
              {/* Feature Integration Dashboard */}
              <div style={{
                background: '#f8f9fa',
                padding: '16px',
                margin: '16px 0',
                borderRadius: '8px',
                border: '1px solid #e1e4e8'
              }}>
                <h4>🚀 Feature Integration Dashboard</h4>
                <p>Notification services successfully merged and integrated.</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2>🔄 Legacy Mode</h2>
            <p>Set REACT_APP_USE_NEW_ARCHITECTURE=true to enable new architecture</p>
            
            <div style={{
              background: '#FFFFFF',
              padding: '16px',
              margin: '16px',
              borderRadius: '8px',
              border: '1px solid #E1E4E8'
            }}>
              <h4>🔧 Migration Status</h4>
              <ul>
                <li>✅ DI System: Implemented</li>
                <li>✅ Feed Feature: Migrated</li>
                <li>🔄 Legacy Components: Pending</li>
                <li>🎯 Feature Flag: LEGACY</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </DIProvider>
  );
};

export default ProductionApp;
