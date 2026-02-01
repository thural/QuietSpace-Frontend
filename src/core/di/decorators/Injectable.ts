/**
 * Injectable Decorator.
 * 
 * Marks a class as injectable for dependency injection.
 * Provides metadata for automatic service registration.
 */

import 'reflect-metadata';

// Metadata keys for reflection
const INJECTABLE_METADATA_KEY = Symbol('injectable');
const INJECT_METADATA_KEY = Symbol('inject');

/**
 * Injectable options interface
 */
export interface InjectableOptions {
  lifetime?: 'transient' | 'singleton' | 'scoped';
  dependencies?: any[];
}

/**
 * Injectable decorator
 * 
 * Marks a class as injectable and stores metadata for DI container.
 */
export function Injectable(options: InjectableOptions = {}): ClassDecorator {
  return function<T extends Function>(target: T): T {
    // Get existing metadata
    const existingMetadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};
    
    // Add new metadata
    const metadata = {
      lifetime: options.lifetime || 'transient',
      dependencies: options.dependencies || [],
      ...existingMetadata
    };
    
    // Store metadata
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, metadata, target);
    
    return target;
  };
}

/**
 * Inject decorator
 * 
 * Marks a constructor parameter as injectable dependency.
 */
export function Inject(token?: any): ParameterDecorator {
  return function(target: any, propertyKey: string | symbol | undefined, parameterIndex: number): any {
    const existingTokens = Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];
    
    // Add injection token
    existingTokens[parameterIndex] = token || propertyKey;
    
    // Store injection metadata
    Reflect.defineMetadata(INJECT_METADATA_KEY, existingTokens, target);
  };
}

/**
 * Get injectable metadata from a class
 */
export function getInjectableMetadata(target: any): any {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};
}

/**
 * Get injection metadata from a class
 */
export function getInjectionMetadata(target: any): any[] {
  return Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];
}

/**
 * Check if a class is injectable
 */
export function isInjectable(target: any): boolean {
  return Reflect.hasMetadata(INJECTABLE_METADATA_KEY, target);
}

/**
 * Get all injectable dependencies from constructor
 */
export function getConstructorDependencies(target: any): any[] {
  const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
  const injectionTokens = getInjectionMetadata(target) || [];
  
  return paramTypes.map((type: any, index: number) => {
    return injectionTokens[index] || type;
  });
}
