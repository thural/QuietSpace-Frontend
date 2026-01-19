#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const process = require('process');

// Component generator script
const generateComponent = (componentName, feature = 'shared') => {
  const templates = {
    component: `import * as React from 'react';
import { useService } from '../../core/di';
import { styles } from './${componentName}.styles';

interface ${componentName}Props {
  userId?: string;
  useMock?: boolean;
  useReactQuery?: boolean;
  enableLogging?: boolean;
  maxNotifications?: number;
}

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  // Choose implementation based on config
  const { notifications, unreadCount, markAsRead, optimisticUpdates, connectionStatus } = useAdvancedNotifications(props.userId || 'default-user', {
    overrideConfig: {
      useMockRepositories: props.useMock || false,
      enableLogging: props.enableLogging || false,
      useReactQuery: props.useReactQuery || false
    }
  });
  
  return (
    <div style={styles.container}>
      <h2>${componentName} Component</h2>
      <p>Enhanced notification implementation with real-time updates and optimistic actions</p>
      
      {/* Connection Status */}
      {connectionStatus && (
        <div style={{ marginBottom: '8px', padding: '4px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <span style={{ color: '#666' }}>🔗</span> {connectionStatus}
        </div>
      )}
      
      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div style={{ 
          backgroundColor: '#dc3545', 
          color: 'white', 
          borderRadius: '50%', 
          padding: '2px 6px', 
          fontSize: '12px',
          fontWeight: 'bold',
          marginLeft: '8px'
        }}>
          {unreadCount}
        </div>
      )}
      
      {/* Notification List */}
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {notifications?.content?.slice(0, props.maxNotifications || 5).map(notification => (
          <div key={notification.id} style={{ 
            padding: '12px', 
            borderBottom: '1px solid #e9ecef', 
            backgroundColor: notification.isRead ? '#f8f9fa' : 'white',
            cursor: notification.isRead ? 'default' : 'pointer'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: getNotificationColor(notification.type) }}>
                  {formatNotificationType(notification.type)}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {formatRelativeTime(notification.createdAt)}
                </div>
              </div>
              <div>
                <button 
                  onClick={() => markAsRead(notification.id)}
                  disabled={notification.isRead}
                  style={{ 
                    padding: '4px 8px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: notification.isRead ? 'default' : 'pointer'
                  }}
                >
                  ✓
                </button>
                <button 
                  onClick={() => {/* Delete handler */}}
                  style={{ 
                    padding: '4px 8px', 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    marginLeft: '4px'
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
      </div>
      
      {/* Optimistic Updates Indicator */}
      {optimisticUpdates.length > 0 && (
        <div style={{ 
          marginTop: '8px', 
          padding: '4px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <span style={{ color: '#666' }}>⚡</span> {optimisticUpdates.length} optimistic updates pending
        </div>
      )}
    </div>
  );
};

export default ${componentName};`,

    styles: `import { CSSProperties } from 'react';

export const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    maxWidth: '400px',
    maxHeight: '600px',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #e9ecef',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px'
  },
  content: {
    flex: 1,
    overflowY: 'auto'
  },
  item: {
    padding: '12px',
    borderBottom: '1px solid #e9ecef',
    backgroundColor: '#ffffff',
    transition: 'background-color 0.2s ease'
  },
  badge: {
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '8px'
  },
  button: {
    padding: '4px 8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  optimisticIndicator: {
    backgroundColor: '#fff3cd',
    padding: '4px',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#666'
  }
} as const;`,

    test: `import { render, screen } from '@testing-library/react';
import { ${componentName} } from '../${componentName}';
import { renderWithDI } from '../../../shared/utils/testUtils';

describe('${componentName}', () => {
  it('should render component', () => {
    renderWithDI(<${componentName} />);
    
    expect(screen.getByText('${componentName} Component')).toBeInTheDocument();
  });

  it('should handle props correctly', () => {
    const props = {
      userId: 'test-user',
      useMock: true,
      useReactQuery: true,
      enableLogging: true
    };
    
    renderWithDI(<${componentName} {...props} />);
    
    expect(screen.getByText('Enhanced notification implementation')).toBeInTheDocument();
    expect(screen.getByText('test-user')).toBeInTheDocument();
  });

  it('should display connection status', () => {
    const props = { userId: 'test-user' };
    
    renderWithDI(<${componentName} {...props} />);
    
    expect(screen.getByText('connecting')).toBeInTheDocument();
  });

  it('should display unread badge', () => {
    const props = { userId: 'test-user' };
    
    renderWithDI(<${componentName} {...props} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});`,

    index: `export { ${componentName} } from './${componentName}';
export { styles } from './${componentName}.styles';`
  };

  const componentDir = path.join(process.cwd(), 'src', 'features', feature, 'presentation', 'components', componentName);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  // Write files
  fs.writeFileSync(path.join(componentDir, `${componentName}.tsx`), templates.component);
  fs.writeFileSync(path.join(componentDir, `${componentName}.styles.ts`), templates.styles);
  fs.writeFileSync(path.join(componentDir, `${componentName}.test.tsx`), templates.test);
  fs.writeFileSync(path.join(componentDir, 'index.ts'), templates.index);

  console.log(`✅ Component ${componentName} created successfully in ${componentDir}`);
};

// Get command line arguments
const args = process.argv.slice(2);
const componentName = args[0];
const feature = args[1] || 'shared';

if (!componentName) {
  console.error('❌ Please provide a component name');
  console.log('Usage: node generate-component.js <ComponentName> [feature]');
  process.exit(1);
}

// Generate component
generateComponent(componentName, feature);
console.log(`🎉 Component generation completed!`);
