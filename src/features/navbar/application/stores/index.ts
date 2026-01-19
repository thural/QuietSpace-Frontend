/**
 * State layer barrel exports.
 * Provides a clean public API for the state layer.
 */

// Advanced state management
export { 
  useNavbarStore,
  useNavbarState,
  useNavbarActions,
  useOptimisticUpdate
} from "./NavbarStore";

// State management with repository pattern integration
export { 
  useNavbarWithState,
  useRealTimeNotifications,
  useNotificationAnalytics
} from "./useNavbarState";
