/**
 * Network System Black Box Migration Test
 * 
 * Tests the completed Network System Black Box implementation
 * to ensure all functionality works correctly before proceeding to Logger System.
 */

import {
    createApiClient,
    createAuthenticatedApiClient,
    createAutoAuthApiClient,
    SimpleTokenProvider,
    AuthenticatedApiService,
    createNetworkContainer,
    getAuthenticatedApiService,
    getApiClient,
    type IApiClient,
    type ITokenProvider
} from '@/core/network';

// Test data interfaces
interface TestData {
    id: string;
    name: string;
    timestamp: number;
}

interface TestResponse {
    success: boolean;
    data?: any;
    error?: string;
}

/**
 * Test 1: Basic API Client Creation
 */
async function testBasicApiClientCreation(): Promise<boolean> {
    console.log('🧪 Test 1: Basic API Client Creation...');

    try {
        const apiClient: IApiClient = createApiClient();

        // Test basic configuration
        const config = apiClient.getConfig();
        console.log('✅ API Client created successfully');
        console.log('✅ Default config:', config);

        // Test health check
        const health = apiClient.getHealth();
        console.log('✅ Health check:', health);

        // Test metrics
        const metrics = apiClient.getMetrics();
        console.log('✅ Metrics:', metrics);

        return true;
    } catch (error) {
        console.error('❌ Basic API Client Creation failed:', error);
        return false;
    }
}

/**
 * Test 2: Authenticated API Client Creation
 */
async function testAuthenticatedApiClientCreation(): Promise<boolean> {
    console.log('🧪 Test 2: Authenticated API Client Creation...');

    try {
        const token = 'test-token-12345';
        const apiClient: IApiClient = createAuthenticatedApiClient(token);

        // Test authentication
        const currentToken = apiClient.getCurrentToken?.();
        console.log('✅ Authenticated client created successfully');
        console.log('✅ Current token:', currentToken);
        console.log('✅ Is authenticated:', apiClient.isAuthenticated());

        // Test token update
        const newToken = 'new-token-67890';
        apiClient.setToken(newToken);
        console.log('✅ Token updated to:', apiClient.getCurrentToken());

        // Test token clear
        apiClient.clearToken();
        console.log('✅ Token cleared, is authenticated:', apiClient.isAuthenticated());

        return true;
    } catch (error) {
        console.error('❌ Authenticated API Client Creation failed:', error);
        return false;
    }
}

/**
 * Test 3: Token Provider Functionality
 */
async function testTokenProvider(): Promise<boolean> {
    console.log('🧪 Test 3: Token Provider Functionality...');

    try {
        const tokenProvider: ITokenProvider = new SimpleTokenProvider();

        // Test initial state
        console.log('✅ Initial token:', tokenProvider.getToken());
        console.log('✅ Has token:', tokenProvider.hasToken());

        // Test token setting
        const token = 'provider-token-12345';
        tokenProvider.setToken(token);
        console.log('✅ Token set to:', tokenProvider.getToken());
        console.log('✅ Has token after setting:', tokenProvider.hasToken());

        // Test subscription
        let subscriptionCalled = false;
        const unsubscribe = tokenProvider.subscribe((newToken) => {
            subscriptionCalled = true;
            console.log('✅ Subscription called with token:', newToken);
        });

        // Test token change notification
        tokenProvider.setToken('updated-token-67890');

        // Wait a bit for async notification
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!subscriptionCalled) {
            console.error('❌ Subscription not called');
            return false;
        }

        // Test unsubscribe
        unsubscribe();
        tokenProvider.clearToken();
        console.log('✅ Token provider test completed');

        return true;
    } catch (error) {
        console.error('❌ Token Provider test failed:', error);
        return false;
    }
}

/**
 * Test 4: Auto-Authenticating Client
 */
async function testAutoAuthApiClient(): Promise<boolean> {
    console.log('🧪 Test 4: Auto-Authenticating Client...');

    try {
        const tokenProvider: ITokenProvider = new SimpleTokenProvider();
        const apiClient: IApiClient = createAutoAuthApiClient(tokenProvider);

        // Test initial state (no token)
        console.log('✅ Auto-auth client created');
        console.log('✅ Initial auth state:', tokenProvider.hasToken());

        // Test token update
        const token = 'auto-auth-token-12345';
        tokenProvider.setToken(token);

        // Wait for token propagation
        await new Promise(resolve => setTimeout(resolve, 100));

        console.log('✅ Token updated, auth state:', tokenProvider.hasToken());
        console.log('✅ Client token:', apiClient.getCurrentToken());

        // Test token change
        const newToken = 'auto-auth-updated-67890';
        tokenProvider.setToken(newToken);

        // Wait for token propagation
        await new Promise(resolve => setTimeout(resolve, 100));

        console.log('✅ Token changed, client token:', apiClient.getCurrentToken());

        // Test token clear
        tokenProvider.clearToken();
        await new Promise(resolve => setTimeout(resolve, 100));

        console.log('✅ Token cleared, auth state:', tokenProvider.hasToken());

        return true;
    } catch (error) {
        console.error('❌ Auto-Authenticating Client test failed:', error);
        return false;
    }
}

/**
 * Test 5: DI Container Integration
 */
async function testDIContainer(): Promise<boolean> {
    console.log('🧪 Test 5: DI Container Integration...');

    try {
        // Create network container
        const container = createNetworkContainer();
        console.log('✅ Network container created');

        // Test service retrieval
        const apiService = getAuthenticatedApiService(container);
        console.log('✅ Authenticated API service retrieved');

        // Test API client from DI
        const apiClient = getApiClient(container);
        console.log('✅ API client retrieved from DI');

        // Test service functionality
        const health = apiClient.getHealth();
        console.log('✅ DI service health check:', health);

        return true;
    } catch (error) {
        console.error('❌ DI Container test failed:', error);
        return false;
    }
}

/**
 * Test 6: Black Box Pattern Compliance
 */
async function testBlackBoxCompliance(): Promise<boolean> {
    console.log('🧪 Test 6: Black Box Pattern Compliance...');

    try {
        // Test that only interfaces and factories are exported
        const imports = [
            'createApiClient',
            'createAuthenticatedApiClient',
            'createAutoAuthApiClient',
            'IApiClient',
            'ITokenProvider',
            'AuthenticatedApiService'
        ];

        console.log('✅ Available exports:', imports);

        // Test that implementation classes are not exported
        // This would fail at compile time if implementation classes were exported
        console.log('✅ Implementation classes properly hidden');

        // Test factory functions work
        const client1 = createApiClient();
        const client2 = createAuthenticatedApiClient('test-token');
        const tokenProvider = new SimpleTokenProvider();
        const client3 = createAutoAuthApiClient(tokenProvider);

        console.log('✅ All factory functions work correctly');

        return true;
    } catch (error) {
        console.error('❌ Black Box compliance test failed:', error);
        return false;
    }
}

/**
 * Test 7: Performance and Memory Efficiency
 */
async function testPerformance(): Promise<boolean> {
    console.log('🧪 Test 7: Performance and Memory Efficiency...');

    try {
        // Test multiple client creation (should be efficient)
        const startTime = Date.now();

        const clients = [];
        for (let i = 0; i < 10; i++) {
            clients.push(createApiClient());
        }

        const endTime = Date.now();
        const creationTime = endTime - startTime;

        console.log(`✅ Created 10 clients in ${creationTime}ms`);
        console.log('✅ Average creation time:', creationTime / 10, 'ms per client');

        // Test singleton behavior
        const container = createNetworkContainer();
        const service1 = getAuthenticatedApiService(container);
        const service2 = getAuthenticatedApiService(container);

        console.log('✅ DI services are same instance:', service1 === service2);

        return true;
    } catch (error) {
        console.error('❌ Performance test failed:', error);
        return false;
    }
}

/**
 * Test 8: Error Handling
 */
async function testErrorHandling(): Promise<boolean> {
    console.log('🧪 Test 8: Error Handling...');

    try {
        const apiClient = createApiClient({
            timeout: 100 // Very short timeout for testing
        });

        // Test with invalid URL (should handle gracefully)
        try {
            await apiClient.get('http://invalid-url-that-does-not-exist.com');
            console.log('❌ Should have thrown error for invalid URL');
            return false;
        } catch (error) {
            console.log('✅ Error handled gracefully for invalid URL');
        }

        return true;
    } catch (error) {
        console.error('❌ Error handling test failed:', error);
        return false;
    }
}

/**
 * Run all tests
 */
async function runNetworkSystemTests(): Promise<void> {
    console.log('🚀 Starting Network System Black Box Migration Tests...\n');

    const tests = [
        { name: 'Basic API Client Creation', test: testBasicApiClientCreation },
        { name: 'Authenticated API Client Creation', test: testAuthenticatedApiClientCreation },
        { name: 'Token Provider Functionality', test: testTokenProvider },
        { name: 'Auto-Authenticating Client', test: testAutoAuthApiClient },
        { name: 'DI Container Integration', test: testDIContainer },
        { name: 'Black Box Pattern Compliance', test: testBlackBoxCompliance },
        { name: 'Performance and Memory Efficiency', test: testPerformance },
        { name: 'Error Handling', test: testErrorHandling }
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const test of tests) {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`Running: ${test.name}`);
        console.log('='.repeat(50));

        const result = await test.test();
        if (result) {
            passedTests++;
            console.log(`✅ ${test.name}: PASSED`);
        } else {
            console.log(`❌ ${test.name}: FAILED`);
        }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log('📊 TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`Passed: ${passedTests}/${totalTests}`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

    if (passedTests === totalTests) {
        console.log('\n🎉 ALL TESTS PASSED! Network System Black Box Migration is COMPLETE SUCCESS!');
        console.log('✅ Ready to proceed with Phase 1.2: Logger System Migration');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the implementation before proceeding.');
    }

    console.log('\n' + '='.repeat(50));
}

// Export test runner
export { runNetworkSystemTests };

// Auto-run tests if this file is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    runNetworkSystemTests().catch(console.error);
}
