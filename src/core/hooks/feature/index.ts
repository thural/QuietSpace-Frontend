/**
 * Feature Hooks - Enterprise Edition
 *
 * Provides feature-specific hooks for enterprise functionality:
 * - Authentication hooks for enterprise auth
 * - WebSocket hooks for real-time communication
 */

export {
  useEnterpriseAuth,
  useFeatureAuth,
  useReactiveFeatureAuth
} from './useAuthentication';

export type {
  EnterpriseAuthOptions,
  FeatureAuthOptions,
  ReactiveFeatureAuthOptions
} from './useAuthentication';

export {
  useEnterpriseWebSocket,
  useFeatureWebSocket,
  useWebSocketConnection,
  useWebSocketMetrics
} from './useWebSocket';

export type {
  UseEnterpriseWebSocketOptions,
  UseFeatureWebSocketOptions,
  WebSocketConnectionState,
  WebSocketMetrics
} from './useWebSocket';
