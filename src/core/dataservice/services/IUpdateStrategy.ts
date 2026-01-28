/**
 * Update Strategy Interface
 * 
 * Single responsibility: Data update strategies for WebSocket messages
 */

export type UpdateStrategyType = 'merge' | 'replace' | 'append' | 'prepend';

export interface IUpdateStrategy {
  /**
   * Apply update strategy to current data
   */
  apply(currentData: any, newData: any, strategy: UpdateStrategyType): any;
  
  /**
   * Check if strategy is supported
   */
  supports(strategy: UpdateStrategyType): boolean;
}
