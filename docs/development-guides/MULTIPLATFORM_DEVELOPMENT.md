# Multiplatform Development Guide

## 🎯 Overview

This guide covers multiplatform development strategies for QuietSpace, including web, mobile, and desktop platforms with shared codebase and platform-specific optimizations.

---

## 📋 Table of Contents

1. [Multiplatform Architecture](#multiplatform-architecture)
2. [Platform Setup](#platform-setup)
3. [Code Sharing Strategies](#code-sharing-strategies)
4. [Platform-Specific Features](#platform-specific-features)
5. [Build & Deployment](#build--deployment)
6. [Testing Strategies](#testing-strategies)
7. [Performance Optimization](#performance-optimization)

---

## 🏗️ Multiplatform Architecture

### **Architecture Overview**
```
┌─────────────────────────────────────────────────────────────────┐
│                    SHARED CODEBASE                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│  │   Domain    │ │   Data      │ │ Application │    │
│  │   Layer     │ │   Layer     │ │   Layer     │    │
│  └─────────────┘ └─────────────┘ └─────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────────┐
                    │   Shared    │
                    │ Components  │
                    │   & Utils    │
                    └─────────────┘
                              │
┌─────────────┬─────────────┬─────────────────────────────────────┐
│    WEB      │   MOBILE    │           DESKTOP                  │
│ Platform    │ Platform    │           Platform                  │
│ (React/TS)  │ (React Native)│         (Electron)                │
│             │             │                                     │
│ • Web UI    │ • Native UI │ • Desktop UI                      │
│ • Web APIs  │ • Native APIs│ • Desktop APIs                   │
│ • Web Storage│ • Native    │ • File System                     │
│             │   Storage   │ • Native Menus                   │
└─────────────┴─────────────┴─────────────────────────────────────┘
```

### **Code Sharing Strategy**
- **Domain Layer**: 100% shared across all platforms
- **Data Layer**: 90% shared (platform-specific adapters)
- **Application Layer**: 80% shared (platform-specific use cases)
- **Presentation Layer**: 20% shared (mostly platform-specific)

### **Directory Structure**
```
src/
├── shared/                 # 100% shared code
│   ├── domain/            # Business logic
│   ├── data/              # Data access (shared)
│   ├── application/       # Application logic (shared)
│   ├── components/        # Shared UI components
│   ├── hooks/             # Shared hooks
│   ├── utils/             # Shared utilities
│   └── types/             # Shared types
├── platform/              # Platform-specific code
│   ├── web/               # Web-specific
│   │   ├── components/    # Web components
│   │   ├── hooks/         # Web hooks
│   │   ├── utils/         # Web utilities
│   │   └── styles/        # Web styles
│   ├── mobile/            # Mobile-specific
│   │   ├── components/    # Native components
│   │   ├── hooks/         # Native hooks
│   │   ├── utils/         # Native utilities
│   │   └── navigation/    # Mobile navigation
│   └── desktop/           # Desktop-specific
│       ├── components/    # Desktop components
│       ├── hooks/         # Desktop hooks
│       ├── utils/         # Desktop utilities
│       └── menus/         # Desktop menus
└── app/                    # Platform-specific app entry points
    ├── web/               # Web app
    ├── mobile/            # Mobile app
    └── desktop/           # Desktop app
```

---

## 🛠️ Platform Setup

### **Web Platform Setup**
```bash
# Install web dependencies
npm install react react-dom react-router-dom
npm install -D @types/react @types/react-dom

# Web-specific tools
npm install vite @vitejs/plugin-react
npm install -D @types/node

# Web development server
npm run dev:web
```

**Web Configuration (vite.config.ts):**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/shared': resolve(__dirname, 'src/shared'),
      '@/platform/web': resolve(__dirname, 'src/platform/web')
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist/web'
  },
  server: {
    port: 3000,
    host: true
  }
});
```

### **Mobile Platform Setup**
```bash
# Install React Native
npx react-native init QuietSpaceMobile
cd QuietSpaceMobile

# Install shared code
npm install ../shared

# Mobile-specific dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
```

**Mobile Configuration (metro.config.js):**
```javascript
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();

  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer')
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      alias: {
        '@shared': '../shared',
        '@/platform/mobile': './src/platform/mobile'
      }
    }
  };
})();
```

### **Desktop Platform Setup**
```bash
# Install Electron
npm install electron electron-builder
npm install -D @types/electron

# Desktop-specific dependencies
npm install electron-store electron-updater

# Desktop build
npm run build:desktop
```

**Desktop Configuration (electron-builder.json):**
```json
{
  "appId": "com.quitespace.desktop",
  "productName": "QuietSpace",
  "directories": {
    "output": "dist/desktop"
  },
  "files": [
    "dist/desktop/**/*",
    "node_modules/**/*"
  ],
  "mac": {
    "category": "public.app-category.social-networking"
  },
  "win": {
    "target": "nsis"
  },
  "linux": {
    "target": "AppImage"
  }
}
```

---

## 🔄 Code Sharing Strategies

### **Shared Domain Layer**
```typescript
// src/shared/domain/entities/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// src/shared/domain/repositories/IUserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

// src/shared/domain/services/UserService.ts
export class UserService {
  constructor(private repository: IUserRepository) {}
  
  async getUser(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }
  
  async createUser(userData: CreateUserRequest): Promise<User> {
    const user = this.createUserEntity(userData);
    return this.repository.save(user);
  }
  
  private createUserEntity(userData: CreateUserRequest): User {
    return {
      id: generateId(),
      name: userData.name,
      email: userData.email,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
```

### **Shared Data Layer**
```typescript
// src/shared/data/repositories/UserRepository.ts
export class UserRepository implements IUserRepository {
  constructor(private dataSource: IDataSource) {}
  
  async findById(id: string): Promise<User | null> {
    const data = await this.dataSource.get(`users/${id}`);
    return data ? this.mapToUser(data) : null;
  }
  
  async save(user: User): Promise<User> {
    await this.dataSource.set(`users/${user.id}`, user);
    return user;
  }
  
  private mapToUser(data: any): User {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }
}

// Platform-specific data sources
// src/platform/web/data/sources/WebDataSource.ts
export class WebDataSource implements IDataSource {
  async get(key: string): Promise<any> {
    const response = await fetch(`/api/data/${key}`);
    return response.json();
  }
  
  async set(key: string, value: any): Promise<void> {
    await fetch(`/api/data/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    });
  }
}

// src/platform/mobile/data/sources/MobileDataSource.ts
export class MobileDataSource implements IDataSource {
  async get(key: string): Promise<any> {
    return AsyncStorage.getItem(key).then(JSON.parse);
  }
  
  async set(key: string, value: any): Promise<void> {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }
}
```

### **Shared Application Layer**
```typescript
// src/shared/application/hooks/useUser.ts
export const useUser = (userId: string) => {
  const userService = useService<IUserService>(TYPES.USER_SERVICE);
  
  const [state, setState] = useState<UserState>({
    user: null,
    isLoading: false,
    error: null
  });
  
  const loadUser = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await userService.getUser(userId);
      setState({ user, isLoading: false, error: null });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: error as Error }));
    }
  }, [userId, userService]);
  
  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId, loadUser]);
  
  return { ...state, loadUser };
};
```

### **Platform-Specific Presentation**
```typescript
// src/platform/web/components/UserProfile.tsx
export const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const { user, isLoading, error } = useUser(userId);
  
  if (isLoading) return <WebLoadingSpinner />;
  if (error) return <WebErrorMessage error={error} />;
  if (!user) return <WebNotFound />;
  
  return (
    <div className="user-profile">
      <WebAvatar src={user.avatarUrl} size="large" />
      <div className="user-info">
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

// src/platform/mobile/components/UserProfile.tsx
export const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const { user, isLoading, error } = useUser(userId);
  
  if (isLoading) return <MobileLoadingSpinner />;
  if (error) return <MobileErrorMessage error={error} />;
  if (!user) return <MobileNotFound />;
  
  return (
    <View style={styles.container}>
      <MobileAvatar source={{ uri: user.avatarUrl }} size="large" />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center'
  },
  userInfo: {
    marginTop: 16,
    alignItems: 'center'
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  email: {
    fontSize: 14,
    color: '#666'
  }
});
```

---

## 📱 Platform-Specific Features

### **Web Platform Features**
```typescript
// Web-specific features
export const WebFeatures = {
  // Web storage
  useWebStorage: (key: string) => {
    const [value, setValue] = useState(localStorage.getItem(key));
    
    const setStorage = useCallback((newValue: string) => {
      localStorage.setItem(key, newValue);
      setValue(newValue);
    }, [key]);
    
    return [value, setStorage] as const;
  },
  
  // Web notifications
  useWebNotifications: () => {
    const requestPermission = async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    };
    
    const showNotification = (title: string, options?: NotificationOptions) => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
      }
    };
    
    return { requestPermission, showNotification };
  },
  
  // Web share API
  useWebShare: () => {
    const share = async (data: ShareData) => {
      if (navigator.share) {
        try {
          await navigator.share(data);
        } catch (error) {
          console.error('Share failed:', error);
        }
      }
    };
    
    return { share };
  }
};
```

### **Mobile Platform Features**
```typescript
// Mobile-specific features
export const MobileFeatures = {
  // Camera access
  useCamera: () => {
    const [image, setImage] = useState<string | null>(null);
    
    const takePicture = async () => {
      try {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1
        });
        
        if (!result.cancelled) {
          setImage(result.uri);
        }
      } catch (error) {
        console.error('Camera error:', error);
      }
    };
    
    return { image, takePicture };
  },
  
  // Push notifications
  usePushNotifications: () => {
    const [token, setToken] = useState<string | null>(null);
    
    useEffect(() => {
      const getToken = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          const tokenData = await Notifications.getExpoPushTokenAsync();
          setToken(tokenData.data);
        }
      };
      
      getToken();
    }, []);
    
    const sendNotification = async (title: string, body: string) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { type: 'notification' }
        },
        trigger: null
      });
    };
    
    return { token, sendNotification };
  },
  
  // Biometric authentication
  useBiometrics: () => {
    const [isSupported, setIsSupported] = useState(false);
    
    useEffect(() => {
      const checkSupport = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsSupported(compatible);
      };
      
      checkSupport();
    }, []);
    
    const authenticate = async () => {
      if (isSupported) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to continue'
        });
        return result.success;
      }
      return false;
    };
    
    return { isSupported, authenticate };
  }
};
```

### **Desktop Platform Features**
```typescript
// Desktop-specific features
export const DesktopFeatures = {
  // File system access
  useFileSystem: () => {
    const [files, setFiles] = useState<string[]>([]);
    
    const selectFiles = async () => {
      try {
        const result = await window.showOpenFilePicker({
          multiple: true,
          types: [{
            description: 'Images',
            accept: { 'image/*': ['.png', '.jpg', '.jpeg'] }
          }]
        });
        
        const filePaths = result.map(file => file.name);
        setFiles(filePaths);
      } catch (error) {
        console.error('File selection error:', error);
      }
    };
    
    return { files, selectFiles };
  },
  
  // System notifications
  useSystemNotifications: () => {
    const showNotification = (title: string, body: string) => {
      if ('Notification' in window) {
        new Notification(title, {
          body,
          icon: '/icon.png',
          silent: false
        });
      }
    };
    
    return { showNotification };
  },
  
  // Menu bar integration
  useMenuBar: () => {
    useEffect(() => {
      if (window.electron) {
        window.electron.setMenu([
          {
            label: 'File',
            submenu: [
              { label: 'New', click: () => console.log('New file') },
              { label: 'Open', click: () => console.log('Open file') },
              { type: 'separator' },
              { label: 'Quit', click: () => window.electron.quit() }
            ]
          },
          {
            label: 'Edit',
            submenu: [
              { label: 'Undo', click: () => console.log('Undo') },
              { label: 'Redo', click: () => console.log('Redo') },
              { type: 'separator' },
              { label: 'Cut', click: () => console.log('Cut') },
              { label: 'Copy', click: () => console.log('Copy') },
              { label: 'Paste', click: () => console.log('Paste') }
            ]
          }
        ]);
      }
    }, []);
  },
  
  // Window management
  useWindowManagement: () => {
    const minimizeWindow = () => {
      if (window.electron) {
        window.electron.minimizeWindow();
      }
    };
    
    const maximizeWindow = () => {
      if (window.electron) {
        window.electron.maximizeWindow();
      }
    };
    
    const closeWindow = () => {
      if (window.electron) {
        window.electron.closeWindow();
      }
    };
    
    return { minimizeWindow, maximizeWindow, closeWindow };
  }
};
```

---

## 🏗️ Build & Deployment

### **Web Build & Deployment**
```json
{
  "scripts": {
    "dev:web": "vite --config vite.config.web.ts",
    "build:web": "tsc && vite build --config vite.config.web.ts",
    "preview:web": "vite preview --config vite.config.web.ts",
    "deploy:web": "npm run build:web && netlify deploy --prod --dir=dist/web"
  }
}
```

**Web Deployment (netlify.toml):**
```toml
[build]
  publish = "dist/web"
  command = "npm run build:web"

[context.production]
  command = "npm run build:web"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Mobile Build & Deployment**
```json
{
  "scripts": {
    "dev:mobile": "npx react-native start",
    "build:android": "cd android && ./gradlew assembleRelease",
    "build:ios": "cd ios && xcodebuild -workspace QuietSpace.xcworkspace -scheme QuietSpace -configuration Release",
    "deploy:android": "npm run build:android && fastlane deploy_android",
    "deploy:ios": "npm run build:ios && fastlane deploy_ios"
  }
}
```

**Mobile Deployment (Fastfile):**
```ruby
platform :ios do
  lane :deploy_ios do
    build_app(
      scheme: "QuietSpace",
      configuration: "Release",
      export_method: "app-store"
    )
    
    upload_to_app_store(
      skip_screenshots: true,
      skip_metadata: true
    )
  end
end

platform :android do
  lane :deploy_android do
    gradle(
      task: "assembleRelease"
    )
    
    upload_to_play_store(
      track: "production"
    )
  end
end
```

### **Desktop Build & Deployment**
```json
{
  "scripts": {
    "dev:desktop": "electron .",
    "build:desktop": "npm run build:web && electron-builder",
    "build:desktop:mac": "npm run build:web && electron-builder --mac",
    "build:desktop:win": "npm run build:web && electron-builder --win",
    "build:desktop:linux": "npm run build:web && electron-builder --linux",
    "deploy:desktop": "npm run build:desktop && electron-builder --publish always"
  }
}
```

**Desktop Auto-updater:**
```typescript
// src/platform/desktop/updater.ts
import { autoUpdater } from 'electron-updater';

export class AppUpdater {
  constructor() {
    autoUpdater.checkForUpdatesAndNotify();
  }
  
  static initialize() {
    if (process.env.NODE_ENV === 'production') {
      autoUpdater.checkForUpdatesAndNotify();
    }
  }
}

// Main process
import { app, BrowserWindow } from 'electron';
import { AppUpdater } from './updater';

app.whenReady().then(() => {
  AppUpdater.initialize();
  // ... app initialization
});
```

---

## 🧪 Testing Strategies

### **Cross-Platform Testing**
```typescript
// Shared test utilities
export const createTestContainer = (): Container => {
  const container = new Container();
  
  // Register mock services
  container.registerSingleton(TYPES.USER_SERVICE, (c) => 
    new MockUserService()
  );
  
  return container;
};

// Platform-specific test utilities
// Web testing
export const renderWebComponent = (component: React.ReactElement) => {
  return render(
    <DIProvider container={createTestContainer()}>
      {component}
    </DIProvider>
  );
};

// Mobile testing
export const renderMobileComponent = (component: React.ReactElement) => {
  return render(
    <DIProvider container={createTestContainer()}>
      {component}
    </DIProvider>
  );
};

// Desktop testing
export const renderDesktopComponent = (component: React.ReactElement) => {
  return render(
    <DIProvider container={createTestContainer()}>
      {component}
    </DIProvider>
  );
};
```

### **Platform-Specific Tests**
```typescript
// Web component tests
describe('WebUserProfile', () => {
  it('should render web user profile', () => {
    const { getByText } = renderWebComponent(
      <WebUserProfile userId="123" />
    );
    
    expect(getByText('John Doe')).toBeInTheDocument();
  });
});

// Mobile component tests
describe('MobileUserProfile', () => {
  it('should render mobile user profile', () => {
    const { getByText } = renderMobileComponent(
      <MobileUserProfile userId="123" />
    );
    
    expect(getByText('John Doe')).toBeTruthy();
  });
});

// Desktop component tests
describe('DesktopUserProfile', () => {
  it('should render desktop user profile', () => {
    const { getByText } = renderDesktopComponent(
      <DesktopUserProfile userId="123" />
    );
    
    expect(getByText('John Doe')).toBeInTheDocument();
  });
});
```

### **E2E Testing**
```typescript
// Cross-platform E2E tests
describe('User Profile E2E', () => {
  it('should load user profile on all platforms', async () => {
    // Web test
    await page.goto('http://localhost:3000/profile/123');
    await expect(page.locator('h1')).toContainText('John Doe');
    
    // Mobile test (using Detox)
    await element(by.id('profile-screen')).tap();
    await expect(element(by.text('John Doe'))).toBeVisible();
    
    // Desktop test (using Spectron)
    await app.client.waitUntilWindowLoaded();
    await app.client.click('#profile-menu');
    await expect(app.client.getText('#profile-name')).toBe('John Doe');
  });
});
```

---

## ⚡ Performance Optimization

### **Web Performance**
```typescript
// Web-specific optimizations
export const WebOptimizations = {
  // Code splitting
  lazyLoadComponents: () => {
    const LazyUserProfile = React.lazy(() => import('./components/UserProfile'));
    return (
      <Suspense fallback={<WebLoadingSpinner />}>
        <LazyUserProfile userId="123" />
      </Suspense>
    );
  },
  
  // Service worker for caching
  registerServiceWorker: () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  },
  
  // Web vitals monitoring
  monitorWebVitals: () => {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
};
```

### **Mobile Performance**
```typescript
// Mobile-specific optimizations
export const MobileOptimizations = {
  // Image optimization
  optimizeImages: (uri: string) => {
    return ImageManipulator.manipulateAsync(uri, [
      { resize: { width: 800, height: 600 } },
      { compress: 0.8 }
    ]);
  },
  
  // Memory management
  manageMemory: () => {
    // Clear image cache
    Image.clearCache();
    
    // Release unused resources
    AppState.addEventListener('memoryWarning', () => {
      console.log('Memory warning received');
    });
  },
  
  // Performance monitoring
  monitorPerformance: () => {
    const performanceMonitor = new PerformanceMonitor({
      onSlowFrame: (fps) => {
        console.warn(`Slow frame detected: ${fps} FPS`);
      }
    });
    
    performanceMonitor.start();
  }
};
```

### **Desktop Performance**
```typescript
// Desktop-specific optimizations
export const DesktopOptimizations = {
  // Window management
  optimizeWindow: () => {
    if (window.electron) {
      window.electron.optimizeWindow({
        minWidth: 800,
        minHeight: 600,
        show: false
      });
    }
  },
  
  // Resource management
  manageResources: () => {
    // Cleanup on window close
    window.addEventListener('beforeunload', () => {
      // Clear caches
      localStorage.clear();
      sessionStorage.clear();
    });
  },
  
  // CPU optimization
  optimizeCPU: () => {
    // Reduce CPU usage during idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Perform background tasks
        console.log('Performing background tasks');
      });
    }
  }
};
```

---

## 📚 Best Practices

### **Code Organization**
1. **Shared First**: Always prioritize shared code
2. **Platform Abstraction**: Abstract platform differences
3. **Consistent APIs**: Maintain consistent interfaces across platforms
4. **Type Safety**: Use TypeScript for all platforms
5. **Testing**: Test shared code thoroughly

### **Performance**
1. **Lazy Loading**: Load platform-specific code on demand
2. **Bundle Optimization**: Optimize bundles for each platform
3. **Memory Management**: Monitor and optimize memory usage
4. **Network Optimization**: Optimize API calls and caching
5. **Asset Optimization**: Optimize images and other assets

### **User Experience**
1. **Platform Conventions**: Follow platform-specific UI conventions
2. **Responsive Design**: Ensure responsive design on web
3. **Native Feel**: Use native components on mobile
4. **Desktop Integration**: Integrate with desktop features
5. **Accessibility**: Ensure accessibility across all platforms

---

**Last Updated**: February 2, 2026  
**Version**: 1.0.0  
**Platforms**: Web, Mobile, Desktop
