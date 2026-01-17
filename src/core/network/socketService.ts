/**
 * WebSocket Service.
 * 
 * Handles real-time communication with the server.
 * Manages connection lifecycle and message handling.
 */

export interface SocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
}

export interface SocketService {
  connect(token: string): Promise<void>;
  disconnect(): void;
  sendMessage(message: SocketMessage): void;
  onMessage(callback: (message: SocketMessage) => void): void;
  isConnected(): boolean;
}

/**
 * WebSocket Service Implementation
 */
class WebSocketServiceImpl implements SocketService {
  private ws: WebSocket | null = null;
  private messageCallbacks: ((message: SocketMessage) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  async connect(token: string): Promise<void> {
    try {
      const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws';
      this.ws = new WebSocket(`${wsUrl}?token=${token}`);
      
      this.ws.onopen = () => {
        console.log('[WebSocket] Connected');
        this.reconnectAttempts = 0;
        this.sendHeartbeat();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message: SocketMessage = JSON.parse(event.data);
          console.log('[WebSocket] Message received:', message);
          
          this.messageCallbacks.forEach(callback => callback(message));
        } catch (error) {
          console.error('[WebSocket] Message parsing error:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('[WebSocket] Disconnected');
        this.handleReconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        this.handleReconnect();
      };
      
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      throw new Error('Failed to connect to WebSocket');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      console.log('[WebSocket] Manually disconnected');
    }
  }

  sendMessage(message: SocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      console.log('[WebSocket] Message sent:', message);
    } else {
      console.warn('[WebSocket] Cannot send message - not connected');
    }
  }

  onMessage(callback: (message: SocketMessage) => void): void {
    this.messageCallbacks.push(callback);
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN || false;
  }

  private sendHeartbeat(): void {
    if (this.isConnected()) {
      this.sendMessage({
        type: 'heartbeat',
        payload: {},
        timestamp: new Date()
      });
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`[WebSocket] Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        // This would need the token - in real implementation, get from auth store
        this.connect('dummy-token');
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('[WebSocket] Max reconnect attempts reached');
    }
  }
}

// Export singleton instance
export const socketService: SocketService = new WebSocketServiceImpl();

export default socketService;
