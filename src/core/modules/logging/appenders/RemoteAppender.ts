/**
 * Remote Appender
 * 
 * Appender that sends log entries to a remote endpoint via HTTP.
 * Features batching, throttling, and retry logic for reliability.
 */

import { IAppender, ILayout, ILogEntry, IAppenderConfig, IThrottlingConfig } from '../types';
import { BaseAppender } from '../classes/BaseAppender';

/**
 * Remote appender configuration interface
 */
interface IRemoteAppenderConfig extends IAppenderConfig {
  /** Remote endpoint URL */
  url: string;
  /** HTTP method */
  method?: 'POST' | 'PUT';
  /** Request headers */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Content type */
  contentType?: string;
}

/**
 * Remote appender implementation
 */
export class RemoteAppender extends BaseAppender {
  private _url: string;
  private _method: 'POST' | 'PUT';
  private _headers: Record<string, string>;
  private _timeout: number;
  private _contentType: string;
  private _batch: ILogEntry[] = [];
  private _batchTimer: any = null;
  private _maxBatchSize: number;
  private _maxBatchInterval: number;
  private _maxPerSecond: number;
  private _lastSendTime: number = 0;
  private _sendCount: number = 0;
  private _currentSecondStart: number = 0;

  constructor(name: string, layout: ILayout, config: IRemoteAppenderConfig) {
    super(name, layout, config);
    this._url = config.url;
    this._method = config.method || 'POST';
    this._headers = config.headers || { 'Content-Type': 'application/json' };
    this._timeout = config.timeout || 10000;
    this._contentType = config.contentType || 'application/json';
    
    // Throttling configuration
    const throttling = config.throttling;
    this._maxBatchSize = throttling?.maxBatchSize ?? 100;
    this._maxBatchInterval = throttling?.maxInterval ?? 5000;
    this._maxPerSecond = throttling?.maxPerSecond ?? 50;
  }

  /**
   * Start appender
   */
  async start(): Promise<void> {
    this._active = true;
    this._batchTimer = setInterval(() => {
      if (this._batch.length > 0) {
        this.sendBatch();
      }
    }, this._maxBatchInterval);
  }

  /**
   * Stop appender
   */
  async stop(): Promise<void> {
    this._active = false;
    
    if (this._batchTimer) {
      clearInterval(this._batchTimer);
      this._batchTimer = null;
    }
    
    // Send remaining batch
    if (this._batch.length > 0) {
      await this.sendBatch();
    }
  }

  /**
   * Append log entry to batch
   */
  append(entry: ILogEntry): void {
    if (!this.isReady()) {
      return;
    }

    // Check throttling
    if (this.shouldThrottle()) {
      return;
    }

    // Add to batch
    this._batch.push(entry);
    this._sendCount++;

    // Send batch if it's full
    if (this._batch.length >= this._maxBatchSize) {
      this.sendBatch();
    }
  }

  /**
   * Check if throttling should be applied
   */
  protected shouldThrottle(): boolean {
    const now = Date.now();
    
    // Reset counter every second
    if (now - this._currentSecondStart >= 1000) {
      this._currentSecondStart = now;
      this._sendCount = 0;
    }
    
    // Check per-second limit
    if (this._sendCount >= this._maxPerSecond) {
      return true;
    }
    
    return false;
  }

  /**
   * Send batch to remote endpoint
   */
  private async sendBatch(): Promise<void> {
    if (this._batch.length === 0) {
      return;
    }

    const batchToSend = [...this._batch];
    this._batch = [];

    try {
      await this.applyRetry(
        () => this.sendRequest(batchToSend),
        'sendBatch'
      );
    } catch (error) {
      // Re-add failed entries to batch for retry
      this._batch.unshift(...batchToSend);
      
      // Limit batch size to prevent infinite growth
      if (this._batch.length > this._maxBatchSize * 2) {
        this._batch = this._batch.slice(0, this._maxBatchSize);
      }
    }
  }

  /**
   * Send HTTP request
   */
  private async sendRequest(entries: ILogEntry[]): Promise<void> {
    const payload = {
      logs: entries,
      timestamp: new Date().toISOString(),
      source: 'web-client',
      version: '1.0.0'
    };

    const response = await fetch(this._url, {
      method: this._method,
      headers: {
        ...this._headers,
        'Content-Type': this._contentType
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(this._timeout)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    this._lastSendTime = Date.now();
  }

  /**
   * Get batch statistics
   */
  getBatchStats(): {
    batchSize: number;
    maxBatchSize: number;
    maxBatchInterval: number;
    maxPerSecond: number;
    lastSendTime: number;
    sendCount: number;
  } {
    return {
      batchSize: this._batch.length,
      maxBatchSize: this._maxBatchSize,
      maxBatchInterval: this._maxBatchInterval,
      maxPerSecond: this._maxPerSecond,
      lastSendTime: this._lastSendTime,
      sendCount: this._sendCount
    };
  }

  /**
   * Force send current batch
   */
  async flush(): Promise<void> {
    if (this._batch.length > 0) {
      await this.sendBatch();
    }
  }

  /**
   * Update throttling configuration
   */
  updateThrottlingConfig(config: IThrottlingConfig): void {
    this._maxBatchSize = config.maxBatchSize ?? this._maxBatchSize;
    this._maxBatchInterval = config.maxInterval ?? this._maxBatchInterval;
    this._maxPerSecond = config.maxPerSecond ?? this._maxPerSecond;
    
    // Restart timer if interval changed
    if (this._batchTimer && config.maxInterval !== undefined) {
      clearInterval(this._batchTimer);
      this._batchTimer = setInterval(() => {
        if (this._batch.length > 0) {
          this.sendBatch();
        }
      }, this._maxBatchInterval);
    }
  }

  /**
   * Get remote configuration
   */
  getRemoteConfig(): {
    url: string;
    method: string;
    headers: Record<string, string>;
    timeout: number;
    contentType: string;
  } {
    return {
      url: this._url,
      method: this._method,
      headers: this._headers,
      timeout: this._timeout,
      contentType: this._contentType
    };
  }

  /**
   * Update remote configuration
   */
  updateRemoteConfig(config: Partial<IRemoteAppenderConfig>): void {
    if (config.url) this._url = config.url;
    if (config.method) this._method = config.method;
    if (config.headers) this._headers = { ...this._headers, ...config.headers };
    if (config.timeout) this._timeout = config.timeout;
    if (config.contentType) this._contentType = config.contentType;
  }

  /**
   * Test connection to remote endpoint
   */
  async testConnection(): Promise<boolean> {
    try {
      const testEntry: ILogEntry = {
        id: 'test-connection',
        timestamp: new Date(),
        level: 'INFO',
        category: this.name,
        message: 'Connection test',
        thread: 'test'
      };

      await this.sendRequest([testEntry]);
      return true;
    } catch (error) {
      this.handleError(error as Error);
      return false;
    }
  }

  /**
   * Cleanup resources
   */
  protected cleanup(): void {
    super.cleanup();
    
    if (this._batchTimer) {
      clearInterval(this._batchTimer);
      this._batchTimer = null;
    }
    
    this._batch = [];
  }
}
