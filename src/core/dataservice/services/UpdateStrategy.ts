/**
 * Update Strategy Implementation
 * 
 * Implements different strategies for updating data from WebSocket messages
 */

import type { IUpdateStrategy, UpdateStrategyType } from './IUpdateStrategy';

export class UpdateStrategy implements IUpdateStrategy {
  apply(currentData: any, newData: any, strategy: UpdateStrategyType): any {
    switch (strategy) {
      case 'replace':
        return this.replace(currentData, newData);
      
      case 'merge':
        return this.merge(currentData, newData);
      
      case 'append':
        return this.append(currentData, newData);
      
      case 'prepend':
        return this.prepend(currentData, newData);
      
      default:
        return newData;
    }
  }

  supports(strategy: UpdateStrategyType): boolean {
    return ['merge', 'replace', 'append', 'prepend'].includes(strategy);
  }

  private replace(currentData: any, newData: any): any {
    return newData;
  }

  private merge(currentData: any, newData: any): any {
    if (Array.isArray(currentData) && newData.id) {
      // Merge array item by ID
      return currentData.map((item: any) =>
        item.id === newData.id ? { ...item, ...newData } : item
      );
    } else if (typeof currentData === 'object' && typeof newData === 'object') {
      // Merge objects
      return { ...currentData, ...newData };
    } else {
      return newData;
    }
  }

  private append(currentData: any, newData: any): any {
    return Array.isArray(currentData)
      ? [...currentData, newData]
      : newData;
  }

  private prepend(currentData: any, newData: any): any {
    return Array.isArray(currentData)
      ? [newData, ...currentData]
      : newData;
  }
}
