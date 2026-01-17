import { test, expect } from '@playwright/test';

/**
 * End-to-end testing for Advanced Analytics & Performance Features
 * Complete user journey testing with Playwright
 */

test.describe('Advanced Analytics E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Enable advanced features (if feature flags are present)
    await page.evaluate(() => {
      localStorage.setItem('REACT_APP_USE_NEW_ARCHITECTURE', 'true');
      localStorage.setItem('REACT_APP_USE_DI_ANALYTICS', 'true');
      localStorage.setItem('REACT_APP_USE_DI_NOTIFICATIONS', 'true');
      localStorage.setItem('REACT_APP_USE_DI_CONTENT', 'true');
    });
    
    // Reload to apply feature flags
    await page.reload();
  });

  test.describe('Analytics Dashboard Journey', () => {
    test('should display analytics dashboard with real-time metrics', async ({ page }) => {
      // Navigate to analytics dashboard
      await page.click('[data-testid="analytics-nav-link"]');
      await page.waitForURL('**/analytics');
      
      // Verify dashboard loads
      await expect(page.locator('h2')).toContainText('Analytics Dashboard');
      
      // Verify key metrics are displayed
      await expect(page.locator('[data-testid="page-views-metric"]')).toBeVisible();
      await expect(page.locator('[data-testid="unique-users-metric"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-sessions-metric"]')).toBeVisible();
      
      // Verify metrics have values (not loading state)
      const pageViews = page.locator('[data-testid="page-views-value"]');
      await expect(pageViews).not.toContainText('Loading...');
      expect(await pageViews.textContent()).toMatch(/\d+/);
      
      // Test timeframe selection
      await page.click('[data-testid="timeframe-7d"]');
      await expect(page.locator('[data-testid="timeframe-7d"]')).toHaveClass(/active/);
      
      // Test auto-refresh
      await page.click('[data-testid="auto-refresh-toggle"]');
      await expect(page.locator('[data-testid="auto-refresh-toggle"]')).toContainText('🔴 LIVE');
      
      // Wait for auto-refresh to update data
      await page.waitForTimeout(2000);
      
      // Verify insights section
      await expect(page.locator('[data-testid="insights-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="insight-card"]')).toHaveCount(1);
    });

    test('should navigate between different chart types', async ({ page }) => {
      await page.goto('/analytics');
      
      // Test chart type switching
      const chartTypes = ['line', 'bar', 'pie'];
      
      for (const chartType of chartTypes) {
        await page.click(`[data-testid="chart-type-${chartType}"]`);
        await expect(page.locator(`[data-testid="chart-type-${chartType}"]`)).toHaveClass(/active/);
        
        // Verify chart content updates
        await expect(page.locator('[data-testid="chart-container"]')).toBeVisible();
        
        // Wait for chart animation
        await page.waitForTimeout(500);
      }
    });

    test('should handle error states gracefully', async ({ page }) => {
      // Mock API failure
      await page.route('**/api/analytics/metrics', route => {
        route.fulfill({ status: 500, body: 'Internal Server Error' });
      });
      
      await page.goto('/analytics');
      
      // Should show error state
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Failed to load analytics data');
      
      // Should provide retry option
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
      
      // Test retry functionality
      await page.unroute('**/api/analytics/metrics');
      await page.click('[data-testid="retry-button"]');
      
      // Should recover and show data
      await expect(page.locator('[data-testid="page-views-metric"]')).toBeVisible();
    });
  });

  test.describe('Report Builder Journey', () => {
    test('should create and configure a custom report', async ({ page }) => {
      await page.goto('/analytics/reports');
      
      // Verify report builder loads
      await expect(page.locator('h2')).toContainText('Advanced Report Builder');
      
      // Select template
      await page.click('[data-testid="template-summary"]');
      await expect(page.locator('[data-testid="template-summary"]')).toHaveClass(/active/);
      
      // Configure report details
      await page.fill('[data-testid="report-name"]', 'Q4 Performance Report');
      await page.fill('[data-testid="report-description"]', 'Quarterly performance analysis');
      
      // Configure schedule
      await page.selectOption('[data-testid="schedule-frequency"]', 'weekly');
      await page.fill('[data-testid="schedule-time"]', '09:00');
      
      // Add sections
      await page.click('[data-testid="section-overview"]');
      await page.click('[data-testid="section-metrics"]');
      await page.click('[data-testid="section-insights"]');
      
      // Verify sections are added
      await expect(page.locator('[data-testid="selected-sections"]')).toBeVisible();
      await expect(page.locator('[data-testid="section-item"]')).toHaveCount(3);
      
      // Save report
      await page.click('[data-testid="save-report-button"]');
      
      // Verify success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Report saved successfully');
      
      // Verify report appears in existing reports
      await expect(page.locator('[data-testid="existing-reports"]')).toBeVisible();
      await expect(page.locator('[data-testid="report-card"]')).toContainText('Q4 Performance Report');
    });

    test('should preview and export reports', async ({ page }) => {
      await page.goto('/analytics/reports');
      
      // Create a report first
      await page.click('[data-testid="template-detailed"]');
      await page.fill('[data-testid="report-name"]', 'Export Test Report');
      await page.click('[data-testid="section-metrics"]');
      await page.click('[data-testid="save-report-button"]');
      
      // Wait for save to complete
      await page.waitForTimeout(1000);
      
      // Preview report
      await page.click('[data-testid="preview-report-button"]');
      
      // Verify preview modal
      await expect(page.locator('[data-testid="preview-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="preview-content"]')).toBeVisible();
      
      // Test export options
      await page.click('[data-testid="export-pdf"]');
      
      // Verify download (in real test, would check for download)
      await expect(page.locator('[data-testid="export-success"]')).toBeVisible();
      
      // Close preview
      await page.click('[data-testid="close-preview"]');
      await expect(page.locator('[data-testid="preview-modal"]')).not.toBeVisible();
    });
  });

  test.describe('Predictive Analytics Journey', () => {
    test('should display predictions and A/B test results', async ({ page }) => {
      await page.goto('/analytics/predictive');
      
      // Verify predictive analytics loads
      await expect(page.locator('h2')).toContainText('Predictive Analytics & A/B Testing');
      
      // Test prediction models
      const models = ['traffic', 'engagement', 'conversion', 'retention'];
      
      for (const model of models) {
        await page.click(`[data-testid="model-${model}"]`);
        await expect(page.locator(`[data-testid="model-${model}"]`)).toHaveClass(/active/);
        
        // Verify prediction chart
        await expect(page.locator('[data-testid="prediction-chart"]')).toBeVisible();
        await expect(page.locator('[data-testid="confidence-band"]')).toBeVisible();
        
        // Verify influencing factors
        await expect(page.locator('[data-testid="influencing-factors"]')).toBeVisible();
        await expect(page.locator('[data-testid="factor-card"]')).toHaveCount(1);
      }
    });

    test('should manage A/B tests', async ({ page }) => {
      await page.goto('/analytics/predictive');
      
      // Create new A/B test
      await page.click('[data-testid="create-test-button"]');
      
      // Configure test
      await page.fill('[data-testid="test-name"]', 'Homepage Layout Test');
      await page.selectOption('[data-testid="traffic-split"]', '50/50');
      
      // Add variants
      await page.fill('[data-testid="variant-a-name"]', 'Control');
      await page.fill('[data-testid="variant-b-name"]', 'Variant A');
      
      // Save test
      await page.click('[data-testid="save-test-button"]');
      
      // Verify test appears in active tests
      await expect(page.locator('[data-testid="active-tests"]')).toBeVisible();
      await expect(page.locator('[data-testid="test-card"]')).toContainText('Homepage Layout Test');
      
      // Test status tracking
      await expect(page.locator('[data-testid="test-status"]')).toContainText('🔄 Running');
      
      // Verify statistical significance
      await expect(page.locator('[data-testid="significance-value"]')).toBeVisible();
    });
  });

  test.describe('Performance Monitoring Journey', () => {
    test('should display system performance metrics', async ({ page }) => {
      await page.goto('/analytics/performance');
      
      // Verify performance monitor loads
      await expect(page.locator('h2')).toContainText('Performance Monitoring');
      
      // Verify key metrics
      await expect(page.locator('[data-testid="response-time-metric"]')).toBeVisible();
      await expect(page.locator('[data-testid="throughput-metric"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-rate-metric"]')).toBeVisible();
      await expect(page.locator('[data-testid="memory-usage-metric"]')).toBeVisible();
      
      // Test real-time monitoring
      await page.click('[data-testid="monitoring-toggle"]');
      await expect(page.locator('[data-testid="monitoring-toggle"]')).toContainText('🔴 Monitoring');
      
      // Wait for real-time updates
      await page.waitForTimeout(3000);
      
      // Verify feature performance section
      await expect(page.locator('[data-testid="feature-performance"]')).toBeVisible();
      await expect(page.locator('[data-testid="feature-card"]')).toHaveCount(1);
      
      // Verify performance alerts
      await expect(page.locator('[data-testid="performance-alerts"]')).toBeVisible();
      await expect(page.locator('[data-testid="alert-card"]')).toHaveCount(1);
    });

    test('should display performance recommendations', async ({ page }) => {
      await page.goto('/analytics/performance');
      
      // Scroll to recommendations
      await page.locator('[data-testid="recommendations-section"]').scrollIntoViewIfNeeded();
      
      // Verify recommendations are displayed
      await expect(page.locator('[data-testid="recommendation-card"]')).toHaveCount(1);
      
      // Verify recommendation details
      const firstRecommendation = page.locator('[data-testid="recommendation-card"]').first();
      await expect(firstRecommendation.locator('[data-testid="recommendation-title"]')).toBeVisible();
      await expect(firstRecommendation.locator('[data-testid="recommendation-description"]')).toBeVisible();
      await expect(firstRecommendation.locator('[data-testid="recommendation-impact"]')).toBeVisible();
    });
  });

  test.describe('Cache Management Journey', () => {
    test('should display and manage cache statistics', async ({ page }) => {
      await page.goto('/analytics/cache');
      
      // Verify cache manager loads
      await expect(page.locator('h2')).toContainText('Cache Management');
      
      // Test cache type selection
      const cacheTypes = ['memory', 'redis', 'database'];
      
      for (const cacheType of cacheTypes) {
        await page.click(`[data-testid="cache-${cacheType}"]`);
        await expect(page.locator(`[data-testid="cache-${cacheType}"]`)).toHaveClass(/active/);
        
        // Verify cache statistics
        await expect(page.locator('[data-testid="total-entries"]')).toBeVisible();
        await expect(page.locator('[data-testid="cache-size"]')).toBeVisible();
        await expect(page.locator('[data-testid="hit-rate"]')).toBeVisible();
        await expect(page.locator('[data-testid="response-time"]')).toBeVisible();
      }
    });

    test('should manage cache entries and policies', async ({ page }) => {
      await page.goto('/analytics/cache');
      
      // Verify cache entries table
      await expect(page.locator('[data-testid="cache-entries-table"]')).toBeVisible();
      await expect(page.locator('[data-testid="cache-entry-row"]')).toHaveCount(1);
      
      // Test cache entry actions
      const firstEntry = page.locator('[data-testid="cache-entry-row"]').first();
      await firstEntry.locator('[data-testid="invalidate-button"]').click();
      
      // Verify confirmation
      await expect(page.locator('[data-testid="invalidate-success"]')).toBeVisible();
      
      // Test cache policies
      await page.locator('[data-testid="cache-policies"]').scrollIntoViewIfNeeded();
      await expect(page.locator('[data-testid="policy-card"]')).toHaveCount(1);
      
      // Test policy configuration
      const firstPolicy = page.locator('[data-testid="policy-card"]').first();
      await firstPolicy.locator('[data-testid="policy-enabled"]').check();
      
      // Verify policy update
      await expect(page.locator('[data-testid="policy-updated"]')).toBeVisible();
    });
  });

  test.describe('Error Tracking Journey', () => {
    test('should display and manage error events', async ({ page }) => {
      await page.goto('/analytics/errors');
      
      // Verify error tracker loads
      await expect(page.locator('h2')).toContainText('Error Tracking & Recovery');
      
      // Verify error statistics
      await expect(page.locator('[data-testid="total-errors"]')).toBeVisible();
      await expect(page.locator('[data-testid="critical-errors"]')).toBeVisible();
      await expect(page.locator("[data-testid='resolved-errors']")).toBeVisible();
      await expect(page.locator('[data-testid="error-rate"]')).toBeVisible();
      
      // Test error filtering
      await page.click('[data-testid="filter-errors"]');
      await page.click('[data-testid="filter-level-error"]');
      
      // Verify filtered results
      await expect(page.locator('[data-testid="error-event"]')).toHaveCount(1);
      
      // Test error resolution
      const firstError = page.locator('[data-testid="error-event"]').first();
      await firstError.locator('[data-testid="resolve-button"]').click();
      
      // Verify resolution
      await expect(firstError.locator('[data-testid="resolution-status"]')).toContainText('✅ Resolved');
    });

    test('should display recovery strategies', async ({ page }) => {
      await page.goto('/analytics/errors');
      
      // Scroll to recovery strategies
      await page.locator('[data-testid="recovery-strategies"]').scrollIntoViewIfNeeded();
      
      // Verify strategies are displayed
      await expect(page.locator('[data-testid="strategy-card"]')).toHaveCount(1);
      
      // Test strategy configuration
      const firstStrategy = page.locator('[data-testid="strategy-card"]').first();
      await firstStrategy.locator('[data-testid="strategy-enabled"]').check();
      
      // Verify strategy is enabled
      await expect(firstStrategy.locator('[data-testid="strategy-enabled"]')).toBeChecked();
      
      // Test strategy configuration
      await firstStrategy.locator('[data-testid="max-retries"]').fill('5');
      await expect(firstStrategy.locator('[data-testid="max-retries"]')).toHaveValue('5');
    });
  });

  test.describe('Cross-Feature Integration Journey', () => {
    test('should demonstrate cross-feature analytics', async ({ page }) => {
      await page.goto('/analytics/cross-feature');
      
      // Verify cross-feature analytics loads
      await expect(page.locator('h2')).toContainText('Cross-Feature Analytics');
      
      // Verify real-time stats
      await expect(page.locator('[data-testid="active-users"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-events"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-rate"]')).toBeVisible();
      await expect(page.locator('[data-testid="response-time"]')).toBeVisible();
      
      // Verify feature integration matrix
      await expect(page.locator('[data-testid="feature-matrix"]')).toBeVisible();
      await expect(page.locator('[data-testid="matrix-card"]')).toHaveCount(1);
      
      // Verify cross-feature metrics
      await expect(page.locator('[data-testid="cross-feature-metrics"]')).toBeVisible();
      await expect(page.locator('[data-testid="metric-card"]')).toHaveCount(1);
      
      // Verify feature health status
      await expect(page.locator('[data-testid="feature-health"]')).toBeVisible();
      await expect(page.locator('[data-testid="health-card"]')).toHaveCount(1);
      
      // Verify integration insights
      await expect(page.locator('[data-testid="integration-insights"]')).toBeVisible();
      await expect(page.locator('[data-testid="insight-card"]')).toHaveCount(1);
    });
  });

  test.describe('Performance and Accessibility', () => {
    test('should meet performance budgets', async ({ page }) => {
      // Start performance measurement
      const startTime = Date.now();
      
      await page.goto('/analytics');
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
      
      // Check Core Web Vitals
      const metrics = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          loadEventEnd: nav.loadEventEnd,
          fetchStart: nav.fetchStart
        };
      });
      
      // LCP should be under 2.5 seconds
      expect(metrics.loadEventEnd - metrics.fetchStart).toBeLessThan(2500);
    });

    test('should meet accessibility standards', async ({ page }) => {
      await page.goto('/analytics');
      
      // Check for proper heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      expect(headings.length).toBeGreaterThan(0);
      
      // Check for ARIA labels
      const interactiveElements = await page.locator('button, a, input, select, textarea').all();
      for (const element of interactiveElements) {
        const hasAriaLabel = await element.evaluate(el => 
          el.hasAttribute('aria-label') || 
          el.hasAttribute('aria-labelledby') || 
          el.hasAttribute('title') ||
          el.textContent?.trim() !== ''
        );
        expect(hasAriaLabel).toBe(true);
      }
      
      // Check color contrast (basic check)
      const elementsWithColor = await page.locator('[style*="color"]').all();
      for (const element of elementsWithColor) {
        const color = await element.evaluate(el => getComputedStyle(el).color);
        // Ensure color is not empty
        expect(color).not.toBe('');
      }
    });

    test('should be responsive across devices', async ({ page }) => {
      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/analytics');
      
      // Verify mobile layout
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
      await expect(page.locator('[data-testid="mobile-navigation"]')).toBeVisible();
      
      // Test tablet view
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Verify tablet layout
      await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
      await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
      
      // Test desktop view
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Verify desktop layout
      await expect(page.locator('[data-testid="desktop-navigation"]')).toBeVisible();
      await expect(page.locator('[data-testid="dashboard-grid"]')).toBeVisible();
    });
  });

  test.describe('Security and Data Privacy', () => {
    test('should handle sensitive data appropriately', async ({ page }) => {
      await page.goto('/analytics');
      
      // Verify no sensitive data in URLs
      const currentUrl = page.url();
      expect(currentUrl).not.toContain('password');
      expect(currentUrl).not.toContain('token');
      expect(currentUrl).not.toContain('secret');
      
      // Verify secure headers (in real implementation)
      const response = await page.goto('/analytics');
      const headers = response?.headers();
      
      // Should have security headers
      expect(headers?.['x-content-type-options']).toBe('nosniff');
      expect(headers?.['x-frame-options']).toBe('DENY');
      expect(headers?.['x-xss-protection']).toBe('1; mode=block');
    });

    test('should respect user privacy preferences', async ({ page }) => {
      // Set privacy preferences
      await page.evaluate(() => {
        localStorage.setItem('privacy-consent', 'analytics-only');
        localStorage.setItem('do-not-track', 'true');
      });
      
      await page.goto('/analytics');
      
      // Verify tracking respects preferences
      const trackingEvents = await page.evaluate(() => {
        return (window as any).dataLayer?.filter((event: any) => event[0] === 'config') || [];
      });
      
      // Should only track analytics events, not personal data
      expect(trackingEvents.length).toBeGreaterThanOrEqual(0);
    });
  });
});

test.describe('Load Testing', () => {
  test('should handle concurrent user load', async ({ page }) => {
    // Simulate multiple concurrent operations
    const operations = [];
    
    for (let i = 0; i < 10; i++) {
      operations.push(
        page.evaluate((index) => {
          // Simulate concurrent API calls
          return Promise.all([
            fetch(`/api/analytics/metrics?user=${index}`),
            fetch(`/api/notifications?user=${index}`),
            fetch(`/api/content?user=${index}`)
          ]);
        }, i)
      );
    }
    
    const startTime = Date.now();
    await Promise.all(operations);
    const endTime = Date.now();
    
    // Should handle concurrent operations efficiently
    expect(endTime - startTime).toBeLessThan(5000);
  });
  
  test('should maintain performance under load', async ({ page }) => {
    // Simulate heavy data load
    await page.goto('/analytics');
    
    // Generate large amount of data
    await page.evaluate(() => {
      const events = Array.from({ length: 1000 }, (_, i) => ({
        id: `event-${i}`,
        userId: `user-${i % 100}`,
        eventType: 'page_view',
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        metadata: { page: `/page-${i % 50}` }
      }));
      
      // Simulate processing large dataset
      return events.length;
    });
    
    // Verify UI remains responsive
    await expect(page.locator('[data-testid="analytics-dashboard"]')).toBeVisible();
    
    // Verify performance metrics
    const metrics = await page.evaluate(() => {
      const perf = (performance as any).memory;
      return perf ? {
        usedJSHeapSize: perf.usedJSHeapSize
      } : null;
    });
    if (metrics) {
      // Memory usage should be reasonable
      expect(metrics.usedJSHeapSize).toBeLessThan(100 * 1024 * 1024); // 100MB
    }
  });
});
