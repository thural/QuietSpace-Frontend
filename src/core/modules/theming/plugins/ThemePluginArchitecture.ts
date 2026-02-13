/**
 * Theme Plugin Architecture
 *
 * Provides a comprehensive plugin system for theme extensions.
 * Supports plugin registration, lifecycle management, sandboxing, and security.
 */

/**
 * Theme plugin interface
 */
export interface IThemePlugin {
  /** Plugin identifier */
  readonly id: string;
  /** Plugin name */
  readonly name: string;
  /** Plugin version */
  readonly version: string;
  /** Plugin description */
  readonly description: string;
  /** Plugin author */
  readonly author: string;
  /** Plugin dependencies */
  readonly dependencies: string[];
  /** Plugin permissions required */
  readonly permissions: PluginPermission[];

  /**
   * Initialize the plugin
   */
  initialize(context: IPluginContext): Promise<void>;

  /**
   * Apply plugin transformations to theme
   */
  apply(theme: any, context: IPluginContext): Promise<any>;

  /**
   * Cleanup plugin resources
   */
  cleanup(): Promise<void>;

  /**
   * Get plugin metadata
   */
  getMetadata(): PluginMetadata;
}

/**
 * Plugin context interface
 */
export interface IPluginContext {
  /** Theme system instance */
  themeSystem: any;
  /** Plugin logger */
  logger: IPluginLogger;
  /** Plugin storage */
  storage: IPluginStorage;
  /** Plugin permissions */
  permissions: PluginPermissions;
  /** Plugin configuration */
  config: Record<string, any>;
}

/**
 * Plugin permissions
 */
export interface PluginPermissions {
  /** Can read theme tokens */
  canReadTokens: boolean;
  /** Can modify theme tokens */
  canModifyTokens: boolean;
  /** Can access system APIs */
  canAccessSystemAPIs: boolean;
  /** Can access external resources */
  canAccessExternalResources: boolean;
  /** Can modify global state */
  canModifyGlobalState: boolean;
}

/**
 * Plugin permission types
 */
export type PluginPermission =
  | 'read_tokens'
  | 'modify_tokens'
  | 'access_system_apis'
  | 'access_external_resources'
  | 'modify_global_state';

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies: string[];
  permissions: PluginPermission[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

/**
 * Plugin logger interface
 */
export interface IPluginLogger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

/**
 * Plugin storage interface
 */
export interface IPluginStorage {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

/**
 * Plugin manager interface
 */
export interface IPluginManager {
  /** Register a plugin */
  register(plugin: IThemePlugin): Promise<void>;

  /** Unregister a plugin */
  unregister(pluginId: string): Promise<void>;

  /** Get registered plugin */
  getPlugin(pluginId: string): IThemePlugin | undefined;

  /** Get all registered plugins */
  getAllPlugins(): IThemePlugin[];

  /** Enable a plugin */
  enable(pluginId: string): Promise<void>;

  /** Disable a plugin */
  disable(pluginId: string): Promise<void>;

  /** Apply all enabled plugins to theme */
  applyPlugins(theme: any): Promise<any>;

  /** Get plugin status */
  getPluginStatus(pluginId: string): PluginStatus;

  /** Get all plugin statuses */
  getAllPluginStatuses(): Record<string, PluginStatus>;
}

/**
 * Plugin status
 */
export interface PluginStatus {
  id: string;
  name: string;
  version: string;
  isActive: boolean;
  isEnabled: boolean;
  hasErrors: boolean;
  lastError?: string;
  loadTime: number;
  memoryUsage: number;
}

/**
 * Plugin configuration
 */
export interface PluginManagerConfig {
  /** Enable plugin sandboxing */
  enableSandboxing: boolean;
  /** Maximum plugin memory usage (bytes) */
  maxPluginMemoryUsage: number;
  /** Plugin timeout (milliseconds) */
  pluginTimeout: number;
  /** Allow external resource access */
  allowExternalResources: boolean;
  /** Plugin directory path */
  pluginDirectory?: string;
  /** Auto-load plugins on startup */
  autoLoadPlugins: boolean;
}

/**
 * Theme Plugin Manager Implementation
 */
export class ThemePluginManager implements IPluginManager {
  private plugins = new Map<string, IThemePlugin>();
  private pluginStatuses = new Map<string, PluginStatus>();
  private pluginContexts = new Map<string, IPluginContext>();
  private enabledPlugins = new Set<string>();

  constructor(
    private readonly config: PluginManagerConfig,
    private readonly themeSystem: any
  ) { }

  /**
   * Register a plugin
   */
  async register(plugin: IThemePlugin): Promise<void> {
    try {
      // Validate plugin
      this.validatePlugin(plugin);

      // Check dependencies
      await this.checkDependencies(plugin);

      // Create plugin context
      const context = this.createPluginContext(plugin);

      // Initialize plugin
      const startTime = Date.now();
      await this.initializePlugin(plugin, context);
      const loadTime = Date.now() - startTime;

      // Store plugin and status
      this.plugins.set(plugin.id, plugin);
      this.pluginContexts.set(plugin.id, context);

      this.pluginStatuses.set(plugin.id, {
        id: plugin.id,
        name: plugin.name,
        version: plugin.version,
        isActive: true,
        isEnabled: false,
        hasErrors: false,
        loadTime,
        memoryUsage: 0
      });

      console.log(`Plugin registered: ${plugin.name} v${plugin.version}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      this.pluginStatuses.set(plugin.id, {
        id: plugin.id,
        name: plugin.name,
        version: plugin.version,
        isActive: false,
        isEnabled: false,
        hasErrors: true,
        lastError: errorMessage,
        loadTime: 0,
        memoryUsage: 0
      });

      throw new Error(`Failed to register plugin ${plugin.id}: ${errorMessage}`);
    }
  }

  /**
   * Unregister a plugin
   */
  async unregister(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginId}`);
    }

    try {
      // Disable plugin first
      if (this.enabledPlugins.has(pluginId)) {
        await this.disable(pluginId);
      }

      // Cleanup plugin
      await plugin.cleanup();

      // Remove from storage
      this.plugins.delete(pluginId);
      this.pluginContexts.delete(pluginId);
      this.pluginStatuses.delete(pluginId);

      console.log(`Plugin unregistered: ${plugin.name}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to unregister plugin ${pluginId}: ${errorMessage}`);
    }
  }

  /**
   * Get registered plugin
   */
  getPlugin(pluginId: string): IThemePlugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * Get all registered plugins
   */
  getAllPlugins(): IThemePlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Enable a plugin
   */
  async enable(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginId}`);
    }

    if (this.enabledPlugins.has(pluginId)) {
      return; // Already enabled
    }

    try {
      const context = this.pluginContexts.get(pluginId);
      if (!context) {
        throw new Error(`Plugin context not found: ${pluginId}`);
      }

      // Re-initialize plugin if needed
      if (!this.pluginStatuses.get(pluginId)?.isActive) {
        await this.initializePlugin(plugin, context);
      }

      this.enabledPlugins.add(pluginId);

      // Update status
      const status = this.pluginStatuses.get(pluginId)!;
      status.isEnabled = true;
      status.hasErrors = false;
      status.lastError = undefined;

      console.log(`Plugin enabled: ${plugin.name}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      const status = this.pluginStatuses.get(pluginId)!;
      status.hasErrors = true;
      status.lastError = errorMessage;

      throw new Error(`Failed to enable plugin ${pluginId}: ${errorMessage}`);
    }
  }

  /**
   * Disable a plugin
   */
  async disable(pluginId: string): Promise<void> {
    if (!this.enabledPlugins.has(pluginId)) {
      return; // Already disabled
    }

    try {
      this.enabledPlugins.delete(pluginId);

      // Update status
      const status = this.pluginStatuses.get(pluginId)!;
      status.isEnabled = false;

      console.log(`Plugin disabled: ${this.plugins.get(pluginId)?.name}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to disable plugin ${pluginId}: ${errorMessage}`);
    }
  }

  /**
   * Apply all enabled plugins to theme
   */
  async applyPlugins(theme: any): Promise<any> {
    let modifiedTheme = theme;

    const enabledPluginIds = Array.from(this.enabledPlugins);
    for (const pluginId of enabledPluginIds) {
      const plugin = this.plugins.get(pluginId);
      const context = this.pluginContexts.get(pluginId);

      if (plugin && context) {
        try {
          modifiedTheme = await plugin.apply(modifiedTheme, context);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`Plugin ${pluginId} failed to apply:`, errorMessage);

          // Update plugin status
          const status = this.pluginStatuses.get(pluginId)!;
          status.hasErrors = true;
          status.lastError = errorMessage;
        }
      }
    }

    return modifiedTheme;
  }

  /**
   * Get plugin status
   */
  getPluginStatus(pluginId: string): PluginStatus {
    const status = this.pluginStatuses.get(pluginId);
    if (!status) {
      throw new Error(`Plugin not found: ${pluginId}`);
    }
    return status;
  }

  /**
   * Get all plugin statuses
   */
  getAllPluginStatuses(): Record<string, PluginStatus> {
    const statuses: Record<string, PluginStatus> = {};
    for (const [id, status] of this.pluginStatuses.entries()) {
      statuses[id] = status;
    }
    return statuses;
  }

  /**
   * Validate plugin
   */
  private validatePlugin(plugin: IThemePlugin): void {
    if (!plugin.id || !plugin.name || !plugin.version) {
      throw new Error('Plugin must have id, name, and version');
    }

    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin with id ${plugin.id} already registered`);
    }

    // Validate permissions
    for (const permission of plugin.permissions) {
      if (!this.isValidPermission(permission)) {
        throw new Error(`Invalid permission: ${permission}`);
      }
    }
  }

  /**
   * Check plugin dependencies
   */
  private async checkDependencies(plugin: IThemePlugin): Promise<void> {
    for (const depId of plugin.dependencies) {
      if (!this.plugins.has(depId)) {
        throw new Error(`Dependency not found: ${depId}`);
      }
    }
  }

  /**
   * Create plugin context
   */
  private createPluginContext(plugin: IThemePlugin): IPluginContext {
    const permissions: PluginPermissions = {
      canReadTokens: plugin.permissions.includes('read_tokens'),
      canModifyTokens: plugin.permissions.includes('modify_tokens'),
      canAccessSystemAPIs: plugin.permissions.includes('access_system_apis'),
      canAccessExternalResources: plugin.permissions.includes('access_external_resources') && this.config.allowExternalResources,
      canModifyGlobalState: plugin.permissions.includes('modify_global_state')
    };

    return {
      themeSystem: this.themeSystem,
      logger: this.createPluginLogger(plugin),
      storage: this.createPluginStorage(plugin),
      permissions,
      config: {}
    };
  }

  /**
   * Initialize plugin
   */
  private async initializePlugin(plugin: IThemePlugin, context: IPluginContext): Promise<void> {
    if (this.config.pluginTimeout > 0) {
      await Promise.race([
        plugin.initialize(context),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Plugin initialization timeout')), this.config.pluginTimeout)
        )
      ]);
    } else {
      await plugin.initialize(context);
    }
  }

  /**
   * Create plugin logger
   */
  private createPluginLogger(plugin: IThemePlugin): IPluginLogger {
    return {
      debug: (message: string, ...args: any[]) => console.debug(`[${plugin.id}] ${message}`, ...args),
      info: (message: string, ...args: any[]) => console.info(`[${plugin.id}] ${message}`, ...args),
      warn: (message: string, ...args: any[]) => console.warn(`[${plugin.id}] ${message}`, ...args),
      error: (message: string, ...args: any[]) => console.error(`[${plugin.id}] ${message}`, ...args)
    };
  }

  /**
   * Create plugin storage
   */
  private createPluginStorage(plugin: IThemePlugin): IPluginStorage {
    const storage = new Map<string, any>();

    return {
      get: async (key: string) => storage.get(key),
      set: async (key: string, value: any) => {
        storage.set(key, value);
      },
      delete: async (key: string) => {
        storage.delete(key);
      },
      clear: async () => {
        storage.clear();
      },
      keys: async () => Array.from(storage.keys())
    };
  }

  /**
   * Check if permission is valid
   */
  private isValidPermission(permission: string): permission is PluginPermission {
    const validPermissions: PluginPermission[] = [
      'read_tokens',
      'modify_tokens',
      'access_system_apis',
      'access_external_resources',
      'modify_global_state'
    ];

    return validPermissions.includes(permission as PluginPermission);
  }
}

/**
 * Plugin factory for creating common plugin types
 */
export class PluginFactory {
  /**
   * Create a token transformation plugin
   */
  static createTokenTransformer(
    id: string,
    name: string,
    transformer: (tokens: any) => any
  ): IThemePlugin {
    return {
      id,
      name,
      version: '1.0.0',
      description: 'Token transformer plugin',
      author: 'System',
      dependencies: [],
      permissions: ['read_tokens', 'modify_tokens'],

      async initialize(context: IPluginContext): Promise<void> {
        context.logger.info('Token transformer plugin initialized');
      },

      async apply(theme: any, context: IPluginContext): Promise<any> {
        context.logger.info('Applying token transformation');
        return transformer(theme);
      },

      async cleanup(): Promise<void> {
        // Cleanup resources
      },

      getMetadata(): PluginMetadata {
        return {
          id,
          name,
          version: '1.0.0',
          description: 'Token transformer plugin',
          author: 'System',
          dependencies: [],
          permissions: ['read_tokens', 'modify_tokens'],
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        };
      }
    };
  }

  /**
   * Create a theme enhancer plugin
   */
  static createThemeEnhancer(
    id: string,
    name: string,
    enhancer: (theme: any) => any
  ): IThemePlugin {
    return {
      id,
      name,
      version: '1.0.0',
      description: 'Theme enhancer plugin',
      author: 'System',
      dependencies: [],
      permissions: ['read_tokens', 'modify_tokens'],

      async initialize(context: IPluginContext): Promise<void> {
        context.logger.info('Theme enhancer plugin initialized');
      },

      async apply(theme: any, context: IPluginContext): Promise<any> {
        context.logger.info('Applying theme enhancement');
        return enhancer(theme);
      },

      async cleanup(): Promise<void> {
        // Cleanup resources
      },

      getMetadata(): PluginMetadata {
        return {
          id,
          name,
          version: '1.0.0',
          description: 'Theme enhancer plugin',
          author: 'System',
          dependencies: [],
          permissions: ['read_tokens', 'modify_tokens'],
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        };
      }
    };
  }
}
