/**
 * Chat Performance Test Component
 * 
 * Interactive performance testing for chat features.
 * Tests query performance, cache efficiency, and real-time capabilities.
 */

import React, { useCallback, useState } from 'react';
import { usePerformanceMonitor } from '@/shared';
import { useChatServices } from '../application/hooks/useChatServices';
import { useCacheInvalidation } from '@/core/hooks/migrationUtils';

interface TestResult {
  testName: string;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  successRate: number;
  errors: string[];
  cacheHitRate?: number;
}

interface PerformanceMetrics {
  cacheStats: any;
  webSocketStats: any;
  queryStats: TestResult[];
}

export const ChatPerformanceTest: React.FC = () => {
  const { startQuery, endQuery, getMetrics, generateReport, reset, exportMetrics } = usePerformanceMonitor();
  const { chatDataService } = useChatServices();
  const invalidateCache = useCacheInvalidation();

  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cacheStats: {},
    webSocketStats: {},
    queryStats: []
  });

  const [testConfig, setTestConfig] = useState({
    iterations: 100,
    chatId: 'test-chat-123',
    userId: 'test-user-456',
    messageContent: 'Test message for performance testing'
  });

  // Run individual performance test
  const runTest = useCallback(async (testName: string, testFunction: () => Promise<any>) => {
    setCurrentTest(testName);
    setIsRunning(true);

    const times: number[] = [];
    const errors: string[] = [];
    let successCount = 0;

    console.log(`🚀 Starting ${testName} with ${testConfig.iterations} iterations...`);

    for (let i = 0; i < testConfig.iterations; i++) {
      const trackingId = startQuery(testName);

      try {
        const startTime = performance.now();
        await testFunction();
        const endTime = performance.now();

        const duration = endTime - startTime;
        times.push(duration);
        successCount++;

        endQuery(trackingId, true, undefined, 1);

        // Show progress every 10 iterations
        if ((i + 1) % 10 === 0) {
          console.log(`  Progress: ${i + 1}/${testConfig.iterations} (${Math.round((i + 1) / testConfig.iterations * 100)}%)`);
        }

      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
        endQuery(trackingId, false, error as Error);

        // Add a penalty time for failures
        times.push(1000); // 1 second penalty
      }

      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const successRate = (successCount / testConfig.iterations) * 100;

    const result: TestResult = {
      testName,
      iterations: testConfig.iterations,
      averageTime,
      minTime,
      maxTime,
      successRate,
      errors
    };

    setResults(prev => [...prev, result]);
    setCurrentTest('');
    setIsRunning(false);

    console.log(`✅ ${testName} completed:`, {
      averageTime: `${averageTime.toFixed(2)}ms`,
      successRate: `${successRate.toFixed(1)}%`,
      errors: errors.length
    });

    return result;
  }, [startQuery, endQuery, chatDataService, testConfig]);

  // Test chat message loading performance
  const testMessageLoading = useCallback(async () => {
    return runTest('Chat Message Loading', async () => {
      return await chatDataService.getMessages(testConfig.chatId, 0, '');
    });
  }, [runTest, chatDataService, testConfig]);

  // Test chat creation performance
  const testChatCreation = useCallback(async () => {
    return runTest('Chat Creation', async () => {
      const chatData = {
        name: 'Performance Test Chat',
        isGroupChat: false,
        recipientId: testConfig.userId,
        text: testConfig.messageContent,
        userIds: [testConfig.userId, 'recipient-789']
      };

      return await chatDataService.createChat(chatData, '');
    });
  }, [runTest, chatDataService, testConfig]);

  // Test cache performance
  const testCachePerformance = useCallback(async () => {
    setCurrentTest('Cache Performance Test');
    setIsRunning(true);

    const cacheTests = [
      { name: 'Cache Write', operation: () => chatDataService.setCacheData('test-key', { data: 'test' }, 60000) },
      { name: 'Cache Read', operation: () => chatDataService.getCacheData('test-key') },
      { name: 'Cache Invalidate', operation: () => chatDataService.invalidateCacheData('test-key') },
      { name: 'Cache Pattern Invalidate', operation: () => invalidateCache.invalidateChatData(testConfig.chatId) }
    ];

    const cacheResults: TestResult[] = [];

    for (const test of cacheTests) {
      const times: number[] = [];

      for (let i = 0; i < 1000; i++) {
        const startTime = performance.now();
        await test.operation();
        const endTime = performance.now();

        times.push(endTime - startTime);
      }

      const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;

      cacheResults.push({
        testName: test.name,
        iterations: 1000,
        averageTime,
        minTime: Math.min(...times),
        maxTime: Math.max(...times),
        successRate: 100,
        errors: []
      });
    }

    setResults(prev => [...prev, ...cacheResults]);
    setCurrentTest('');
    setIsRunning(false);

    console.log('✅ Cache Performance Test completed:', cacheResults);
  }, [chatDataService, invalidateCache, testConfig]);

  // Test real-time subscription performance
  const testRealTimeSubscriptions = useCallback(async () => {
    setCurrentTest('Real-time Subscriptions');
    setIsRunning(true);

    const subscriptionTimes: number[] = [];
    let subscriptionCount = 0;

    // Test subscription creation and cleanup
    for (let i = 0; i < 100; i++) {
      const startTime = performance.now();

      // Create subscription
      const unsubscribe = chatDataService.subscribeToChatMessages(testConfig.chatId, () => {
        // Handle message
      });

      subscriptionCount++;

      // Cleanup subscription
      unsubscribe();

      const endTime = performance.now();
      subscriptionTimes.push(endTime - startTime);
    }

    const averageTime = subscriptionTimes.reduce((sum, time) => sum + time, 0) / subscriptionTimes.length;

    const result: TestResult = {
      testName: 'Real-time Subscriptions',
      iterations: 100,
      averageTime,
      minTime: Math.min(...subscriptionTimes),
      maxTime: Math.max(...subscriptionTimes),
      successRate: 100,
      errors: []
    };

    setResults(prev => [...prev, result]);
    setCurrentTest('');
    setIsRunning(false);

    console.log('✅ Real-time Subscriptions Test completed:', {
      averageTime: `${averageTime.toFixed(2)}ms`,
      subscriptions: subscriptionCount
    });
  }, [chatDataService, testConfig]);

  // Run all performance tests
  const runAllTests = useCallback(async () => {
    console.log('🚀 Starting Chat Performance Test Suite...');

    const allTests = [
      testMessageLoading,
      testChatCreation,
      testCachePerformance,
      testRealTimeSubscriptions
    ];

    for (const test of allTests) {
      await test();
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Collect final metrics
    const cacheStats = chatDataService.getChatCacheStats();
    const webSocketStats = chatDataService.getWebSocketStats();

    setMetrics({
      cacheStats,
      webSocketStats,
      queryStats: results
    });

    console.log('✅ All Performance Tests Completed!');
    console.log('📊 Final Metrics:', { cacheStats, webSocketStats, totalTests: results.length });
  }, [testMessageLoading, testChatCreation, testCachePerformance, testRealTimeSubscriptions, chatDataService, results]);

  // Clear results
  const clearResults = () => {
    setResults([]);
    setMetrics({
      cacheStats: {},
      webSocketStats: {},
      queryStats: []
    });
  };

  // Format time for display
  const formatTime = (ms: number) => {
    if (ms < 1) return '< 1ms';
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🚀 Chat Feature Performance Test</h2>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Test Configuration</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <div>
            <label>Iterations:</label>
            <input
              type="number"
              value={testConfig.iterations}
              onChange={(e) => setTestConfig(prev => ({ ...prev, iterations: parseInt(e.target.value) || 100 }))}
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          <div>
            <label>Chat ID:</label>
            <input
              type="text"
              value={testConfig.chatId}
              onChange={(e) => setTestConfig(prev => ({ ...prev, chatId: e.target.value }))}
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          <div>
            <label>User ID:</label>
            <input
              type="text"
              value={testConfig.userId}
              onChange={(e) => setTestConfig(prev => ({ ...prev, userId: e.target.value }))}
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          style={{
            padding: '12px 24px',
            backgroundColor: isRunning ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </button>

        <button
          onClick={clearResults}
          disabled={isRunning}
          style={{
            padding: '12px 24px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          Clear Results
        </button>
      </div>

      {currentTest && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '6px' }}>
          <strong>Running:</strong> {currentTest}
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Test Results</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '6px' }}>
            {results.map((result, index) => (
              <div key={index} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 'bold', color: result.successRate === 100 ? '#28a745' : result.successRate >= 90 ? '#ffc107' : '#dc3545' }}>
                  {result.testName}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Iterations: {result.iterations} |
                  Avg Time: {formatTime(result.averageTime)} |
                  Min: {formatTime(result.minTime)} |
                  Max: {formatTime(result.maxTime)} |
                  Success: {result.successRate.toFixed(1)}%
                </div>
                {result.errors.length > 0 && (
                  <div style={{ fontSize: '12px', color: '#dc3545' }}>
                    Errors: {result.errors.slice(0, 3).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(metrics.cacheStats).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Cache Statistics</h3>
          <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <div>Total Chat Entries: {metrics.cacheStats.totalChatEntries}</div>
            <div>Message Entries: {metrics.cacheStats.messageEntries}</div>
            <div>Chat Info Entries: {metrics.cacheStats.chatInfoEntries}</div>
            <div>User Entries: {metrics.cacheStats.userEntries}</div>
            <div>Real-time Entries: {metrics.cacheStats.realtimeEntries}</div>
          </div>
        </div>
      )}

      {Object.keys(metrics.webSocketStats).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>WebSocket Statistics</h3>
          <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <div>Total Subscriptions: {metrics.webSocketStats.totalSubscriptions}</div>
            <div>Active Patterns: {metrics.webSocketStats.patterns.join(', ')}</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
        <h3>Performance Monitor</h3>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <div>Active Queries: {getMetrics().queryPerformance.totalQueries}</div>
          <div>Total Queries: {getMetrics().queryPerformance.totalQueries}</div>
          <div>Average Query Time: {formatTime(getMetrics().queryPerformance.averageQueryTime)}</div>
          <div>Cache Hit Rate: {getMetrics().cachePerformance.hitRate}%</div>
        </div>
      </div>
    </div>
  );
};
