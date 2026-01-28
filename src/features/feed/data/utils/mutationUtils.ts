/**
 * Shared mutation utilities for feed operations
 * Eliminates DRY violations across feed hooks
 */

export interface MutationOptions {
  operationName: string;
  onSuccessCallback?: () => void;
  customErrorHandler?: (error: any) => void;
}

/**
 * Creates standardized mutation configuration
 */
export const createMutationConfig = (options: MutationOptions) => {
  const { operationName, onSuccessCallback, customErrorHandler } = options;
  
  return {
    onSuccess: () => {
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      if (customErrorHandler) {
        customErrorHandler(error);
      } else {
        console.error(`Error ${operationName}:`, error);
      }
    }
  };
};

/**
 * Creates standardized mutation configuration for post operations
 */
export const createPostMutationConfig = (
  operationName: string, 
  onSuccessCallback?: () => void
) => createMutationConfig({
  operationName,
  onSuccessCallback,
  customErrorHandler: (error) => {
    console.error(`Error ${operationName}:`, error);
  }
});

/**
 * Creates standardized mutation configuration for comment operations
 */
export const createCommentMutationConfig = (
  operationName: string,
  onSuccessCallback?: () => void
) => createMutationConfig({
  operationName,
  onSuccessCallback,
  customErrorHandler: (error) => {
    console.error(`Error ${operationName}:`, error);
  }
});

/**
 * Creates standardized mutation configuration for interaction operations
 */
export const createInteractionMutationConfig = (operationName: string) => 
  createMutationConfig({
    operationName,
    customErrorHandler: (error) => {
      console.error(`Error ${operationName} post:`, error);
    }
  });
