/**
 * Update Strategy Implementation
 * 
 * Implements different strategies for updating data from WebSocket messages
 */

/**
 * Update Strategy implementation class
 */
export class UpdateStrategy {
  /**
   * Apply update strategy to current data
   * @param {*} currentData - Current data
   * @param {*} newData - New data to apply
   * @param {string} strategy - Update strategy type
   * @returns {*} Updated data
   */
  apply(currentData, newData, strategy) {
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

  /**
   * Check if strategy is supported
   * @param {string} strategy - Strategy to check
   * @returns {boolean} Whether strategy is supported
   */
  supports(strategy) {
    return ['merge', 'replace', 'append', 'prepend'].includes(strategy);
  }

  /**
   * Replace current data with new data
   * @private
   * @param {*} currentData - Current data
   * @param {*} newData - New data
   * @returns {*} New data
   */
  replace(currentData, newData) {
    return newData;
  }

  /**
   * Merge current data with new data
   * @private
   * @param {*} currentData - Current data
   * @param {*} newData - New data
   * @returns {*} Merged data
   */
  merge(currentData, newData) {
    if (Array.isArray(currentData) && newData.id) {
      // Merge array item by ID
      return currentData.map(item =>
        item.id === newData.id ? { ...item, ...newData } : item
      );
    } else if (typeof currentData === 'object' && typeof newData === 'object') {
      // Merge objects
      return { ...currentData, ...newData };
    } else {
      return newData;
    }
  }

  /**
   * Append new data to current data
   * @private
   * @param {*} currentData - Current data
   * @param {*} newData - New data
   * @returns {*} Appended data
   */
  append(currentData, newData) {
    return Array.isArray(currentData)
      ? [...currentData, newData]
      : newData;
  }

  /**
   * Prepend new data to current data
   * @private
   * @param {*} currentData - Current data
   * @param {*} newData - New data
   * @returns {*} Prepended data
   */
  prepend(currentData, newData) {
    return Array.isArray(currentData)
      ? [newData, ...currentData]
      : newData;
  }
}
