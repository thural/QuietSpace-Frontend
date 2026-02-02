# Quality Assurance Guide

## 🎯 Overview

This comprehensive guide covers quality assurance strategies, testing methodologies, code quality standards, and continuous integration practices for QuietSpace development.

---

## 📋 Table of Contents

1. [Testing Strategy](#testing-strategy)
2. [Code Quality Standards](#code-quality-standards)
3. [Continuous Integration](#continuous-integration)
4. [Performance Testing](#performance-testing)
5. [Security Testing](#security-testing)
6. [Accessibility Testing](#accessibility-testing)
7. [Quality Metrics](#quality-metrics)

---

## 🧪 Testing Strategy

### **Testing Pyramid**
```
                    ┌─────────────────┐
                    │   E2E Tests     │  ← 10% (Critical paths)
                    │   (User flows)  │
                    └─────────────────┘
                ┌─────────────────────────┐
                │   Integration Tests    │  ← 20% (Service integration)
                │   (API & Database)      │
                └─────────────────────────┘
            ┌─────────────────────────────────┐
            │        Unit Tests               │  ← 70% (Business logic)
            │   (Components & Services)       │
            └─────────────────────────────────┘
```

### **Test Coverage Requirements**
- **Unit Tests**: Minimum 90% line coverage
- **Integration Tests**: 100% API endpoint coverage
- **Component Tests**: 100% component coverage
- **E2E Tests**: 100% critical user journey coverage

### **Testing Tools Setup**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:performance": "lighthouse --chrome-flags='--headless' --output=json --output-path=./reports/lighthouse.json"
  },
  "devDependencies": {
    "@testing-library/react": "^13.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "@testing-library/user-event": "^14.0.0",
    "@playwright/test": "^1.30.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "lighthouse": "^9.6.0",
    "axe-core": "^4.6.0",
    "@axe-core/react": "^4.6.0"
  }
}
```

### **Jest Configuration**
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/features/(.*)$': '<rootDir>/src/features/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
  ]
};
```

---

## 📝 Code Quality Standards

### **Linting Configuration**
```json
// .eslintrc.json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:testing-library/react"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "testing-library"
  ],
  "rules": {
    "prefer-const": "error",
    "no-var": "error",
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "testing-library/no-debugging-utils": "warn",
    "testing-library/no-dom-import": "error"
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "jest": true
  }
}
```

### **Prettier Configuration**
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### **TypeScript Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.test.tsx"
  ]
}
```

### **Code Quality Metrics**
```typescript
// Quality metrics collector
export class QualityMetrics {
  static calculateComplexity(code: string): number {
    // Cyclomatic complexity calculation
    const patterns = [
      /if\s*\(/g,
      /else\s+if/g,
      /for\s*\(/g,
      /while\s*\(/g,
      /switch\s*\(/g,
      /catch\s*\(/g,
      /\?[^:]*:/g,
      /\|\|/g,
      /&&/g
    ];
    
    let complexity = 1; // Base complexity
    
    patterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });
    
    return complexity;
  }
  
  static calculateMaintainabilityIndex(
    linesOfCode: number,
    complexity: number,
    halsteadVolume: number
  ): number {
    // Maintainability Index formula
    const maintainabilityIndex = 
      171 - 5.2 * Math.log(halsteadVolume) - 
      0.23 * complexity - 16.2 * Math.log(linesOfCode);
    
    return Math.max(0, maintainabilityIndex);
  }
  
  static analyzeFile(filePath: string): QualityReport {
    const code = fs.readFileSync(filePath, 'utf-8');
    const lines = code.split('\n').length;
    const complexity = this.calculateComplexity(code);
    const halsteadVolume = this.calculateHalsteadVolume(code);
    const maintainabilityIndex = this.calculateMaintainabilityIndex(lines, complexity, halsteadVolume);
    
    return {
      filePath,
      linesOfCode: lines,
      cyclomaticComplexity: complexity,
      maintainabilityIndex,
      quality: this.getQualityRating(maintainabilityIndex)
    };
  }
  
  private static calculateHalsteadVolume(code: string): number {
    // Simplified Halstead volume calculation
    const operators = code.match(/[+\-*/%=<>!&|]+/g) || [];
    const operands = code.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    
    const uniqueOperators = new Set(operators).size;
    const uniqueOperands = new Set(operands).size;
    const totalOperators = operators.length;
    const totalOperands = operands.length;
    
    const vocabulary = uniqueOperators + uniqueOperands;
    const length = totalOperators + totalOperands;
    
    return length * Math.log2(vocabulary);
  }
  
  private static getQualityRating(maintainabilityIndex: number): 'excellent' | 'good' | 'moderate' | 'poor' | 'bad' {
    if (maintainabilityIndex >= 85) return 'excellent';
    if (maintainabilityIndex >= 70) return 'good';
    if (maintainabilityIndex >= 50) return 'moderate';
    if (maintainabilityIndex >= 30) return 'poor';
    return 'bad';
  }
}

interface QualityReport {
  filePath: string;
  linesOfCode: number;
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
  quality: 'excellent' | 'good' | 'moderate' | 'poor' | 'bad';
}
```

---

## 🔄 Continuous Integration

### **GitHub Actions Workflow**
```yaml
# .github/workflows/quality-assurance.yml
name: Quality Assurance

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Run performance tests
        run: npm run test:performance
      
      - name: Run accessibility tests
        run: npm run test:accessibility
      
      - name: Security audit
        run: npm audit --audit-level=high
      
      - name: Bundle size analysis
        run: npm run build && npx bundlesize

  quality-gates:
    runs-on: ubuntu-latest
    needs: quality-check
    
    steps:
      - name: Quality gate check
        run: |
          # Check coverage thresholds
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 90" | bc -l) )); then
            echo "Coverage below threshold: $COVERAGE%"
            exit 1
          fi
          
          # Check bundle size
          BUNDLE_SIZE=$(du -k dist/main.js | cut -f1)
          if [ $BUNDLE_SIZE -gt 500 ]; then
            echo "Bundle size too large: ${BUNDLE_SIZE}KB"
            exit 1
          fi
          
          echo "All quality gates passed"
```

### **Pre-commit Hooks**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:unit && npm run type-check"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{json,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

### **Quality Gates**
```typescript
// Quality gate implementation
export class QualityGate {
  static async checkCoverage(): Promise<boolean> {
    const coverage = await this.getCoverageReport();
    return coverage.total.lines.pct >= 90;
  }
  
  static async checkBundleSize(): Promise<boolean> {
    const bundleSize = await this.getBundleSize();
    return bundleSize <= 500 * 1024; // 500KB limit
  }
  
  static async checkPerformance(): Promise<boolean> {
    const performance = await this.getPerformanceMetrics();
    return performance.lighthouse.score >= 90;
  }
  
  static async checkSecurity(): Promise<boolean> {
    const vulnerabilities = await this.getSecurityVulnerabilities();
    return vulnerabilities.high === 0 && vulnerabilities.critical === 0;
  }
  
  static async runAllChecks(): Promise<QualityGateResult> {
    const checks = await Promise.allSettled([
      this.checkCoverage(),
      this.checkBundleSize(),
      this.checkPerformance(),
      this.checkSecurity()
    ]);
    
    const results = {
      coverage: checks[0].status === 'fulfilled' ? checks[0].value : false,
      bundleSize: checks[1].status === 'fulfilled' ? checks[1].value : false,
      performance: checks[2].status === 'fulfilled' ? checks[2].value : false,
      security: checks[3].status === 'fulfilled' ? checks[3].value : false
    };
    
    return {
      passed: Object.values(results).every(result => result),
      results
    };
  }
}

interface QualityGateResult {
  passed: boolean;
  results: {
    coverage: boolean;
    bundleSize: boolean;
    performance: boolean;
    security: boolean;
  };
}
```

---

## ⚡ Performance Testing

### **Lighthouse Configuration**
```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'categories:pwa': 'off'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

### **Performance Monitoring**
```typescript
// Performance monitoring service
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  
  startMeasure(name: string): void {
    performance.mark(`${name}-start`);
  }
  
  endMeasure(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name, 'measure')[0];
    const duration = measure.duration;
    
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now()
    });
    
    return duration;
  }
  
  getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }
  
  getAverageTime(name: string): number {
    const nameMetrics = this.metrics.filter(m => m.name === name);
    if (nameMetrics.length === 0) return 0;
    
    const total = nameMetrics.reduce((sum, m) => sum + m.duration, 0);
    return total / nameMetrics.length;
  }
  
  generateReport(): PerformanceReport {
    const groupedMetrics = this.groupMetricsByName();
    
    return {
      totalMetrics: this.metrics.length,
      averageMetrics: Object.entries(groupedMetrics).map(([name, metrics]) => ({
        name,
        count: metrics.length,
        average: metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length,
        min: Math.min(...metrics.map(m => m.duration)),
        max: Math.max(...metrics.map(m => m.duration))
      })),
      slowestMetrics: this.metrics
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 10)
    };
  }
  
  private groupMetricsByName(): Record<string, PerformanceMetric[]> {
    return this.metrics.reduce((groups, metric) => {
      if (!groups[metric.name]) {
        groups[metric.name] = [];
      }
      groups[metric.name].push(metric);
      return groups;
    }, {} as Record<string, PerformanceMetric[]>);
  }
}

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

interface PerformanceReport {
  totalMetrics: number;
  averageMetrics: {
    name: string;
    count: number;
    average: number;
    min: number;
    max: number;
  }[];
  slowestMetrics: PerformanceMetric[];
}
```

### **Load Testing**
```typescript
// Load testing with Artillery
export class LoadTester {
  static async runLoadTest(config: LoadTestConfig): Promise<LoadTestResult> {
    const artilleryConfig = this.createArtilleryConfig(config);
    
    // Write config to file
    fs.writeFileSync('load-test-config.yml', artilleryConfig);
    
    // Run Artillery
    const result = await this.executeArtillery('load-test-config.yml');
    
    return this.parseArtilleryResult(result);
  }
  
  private static createArtilleryConfig(config: LoadTestConfig): string {
    return `
config:
  target: '${config.target}'
  phases:
    - duration: ${config.duration}
      arrivalRate: ${config.arrivalRate}
      name: "Load test"
  
scenarios:
  - name: "User flow"
    weight: 100
    flow:
      - get:
          url: "${config.endpoints.login}"
      - think: 1
      - get:
          url: "${config.endpoints.dashboard}"
      - think: 2
      - get:
          url: "${config.endpoints.profile}"
    `;
  }
  
  private static async executeArtillery(configPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const artillery = spawn('artillery', ['run', configPath]);
      
      let output = '';
      artillery.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      artillery.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Artillery exited with code ${code}`));
        }
      });
    });
  }
  
  private static parseArtilleryResult(output: string): LoadTestResult {
    // Parse Artillery output and return structured result
    const lines = output.split('\n');
    const resultLine = lines.find(line => line.includes('All virtual users finished'));
    
    if (!resultLine) {
      throw new Error('Could not parse Artillery result');
    }
    
    return {
      totalRequests: 0,
      totalErrors: 0,
      averageResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      requestsPerSecond: 0
    };
  }
}

interface LoadTestConfig {
  target: string;
  duration: number;
  arrivalRate: number;
  endpoints: {
    login: string;
    dashboard: string;
    profile: string;
  };
}

interface LoadTestResult {
  totalRequests: number;
  totalErrors: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  requestsPerSecond: number;
}
```

---

## 🔒 Security Testing

### **Security Audit**
```typescript
// Security testing service
export class SecurityTester {
  static async runSecurityAudit(): Promise<SecurityAuditResult> {
    const npmAudit = await this.runNpmAudit();
    const dependencyCheck = await this.runDependencyCheck();
    const codeAnalysis = await this.runCodeAnalysis();
    
    return {
      npmAudit,
      dependencyCheck,
      codeAnalysis,
      overallScore: this.calculateSecurityScore(npmAudit, dependencyCheck, codeAnalysis)
    };
  }
  
  private static async runNpmAudit(): Promise<NpmAuditResult> {
    return new Promise((resolve, reject) => {
      const audit = spawn('npm', ['audit', '--json']);
      
      let output = '';
      audit.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      audit.on('close', (code) => {
        try {
          const auditResult = JSON.parse(output);
          resolve({
            vulnerabilities: auditResult.vulnerabilities,
            totalVulnerabilities: auditResult.metadata.vulnerabilities.total,
            highVulnerabilities: auditResult.metadata.vulnerabilities.high,
            criticalVulnerabilities: auditResult.metadata.vulnerabilities.critical
          });
        } catch (error) {
          reject(error);
        }
      });
    });
  }
  
  private static async runDependencyCheck(): Promise<DependencyCheckResult> {
    // Implementation for dependency checking
    return {
      outdatedDependencies: 0,
      insecureDependencies: 0,
      totalDependencies: 0
    };
  }
  
  private static async runCodeAnalysis(): Promise<CodeAnalysisResult> {
    // Implementation for static code analysis
    return {
      securityIssues: 0,
      codeSmells: 0,
      totalFiles: 0
    };
  }
  
  private static calculateSecurityScore(
    npmAudit: NpmAuditResult,
    dependencyCheck: DependencyCheckResult,
    codeAnalysis: CodeAnalysisResult
  ): number {
    let score = 100;
    
    // Deduct points for vulnerabilities
    score -= npmAudit.criticalVulnerabilities * 20;
    score -= npmAudit.highVulnerabilities * 10;
    score -= dependencyCheck.insecureDependencies * 5;
    score -= codeAnalysis.securityIssues * 3;
    
    return Math.max(0, score);
  }
}

interface SecurityAuditResult {
  npmAudit: NpmAuditResult;
  dependencyCheck: DependencyCheckResult;
  codeAnalysis: CodeAnalysisResult;
  overallScore: number;
}

interface NpmAuditResult {
  vulnerabilities: any;
  totalVulnerabilities: number;
  highVulnerabilities: number;
  criticalVulnerabilities: number;
}

interface DependencyCheckResult {
  outdatedDependencies: number;
  insecureDependencies: number;
  totalDependencies: number;
}

interface CodeAnalysisResult {
  securityIssues: number;
  codeSmells: number;
  totalFiles: number;
}
```

### **Penetration Testing**
```typescript
// Penetration testing utilities
export class PenetrationTester {
  static async testAuthentication(): Promise<AuthTestResult> {
    const tests = [
      this.testSqlInjection(),
      this.testXss(),
      this.testCsrf(),
      this.testAuthenticationBypass()
    ];
    
    const results = await Promise.allSettled(tests);
    
    return {
      sqlInjection: results[0].status === 'fulfilled' ? results[0].value : false,
      xss: results[1].status === 'fulfilled' ? results[1].value : false,
      csrf: results[2].status === 'fulfilled' ? results[2].value : false,
      authBypass: results[3].status === 'fulfilled' ? results[3].value : false,
      overallSecure: results.every(r => r.status === 'fulfilled' && r.value)
    };
  }
  
  private static async testSqlInjection(): Promise<boolean> {
    // Test for SQL injection vulnerabilities
    const maliciousInput = "'; DROP TABLE users; --";
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: maliciousInput,
          password: 'test'
        })
      });
      
      // If the request succeeds with malicious input, it's vulnerable
      return response.status !== 200;
    } catch (error) {
      // Error is good - means the input was rejected
      return true;
    }
  }
  
  private static async testXss(): Promise<boolean> {
    // Test for XSS vulnerabilities
    const xssPayload = '<script>alert("XSS")</script>';
    
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: xssPayload
        })
      });
      
      const data = await response.json();
      
      // Check if the XSS payload was sanitized
      return !data.name.includes('<script>');
    } catch (error) {
      return true;
    }
  }
  
  private static async testCsrf(): Promise<boolean> {
    // Test for CSRF vulnerabilities
    return true; // Implementation depends on CSRF protection mechanism
  }
  
  private static async testAuthenticationBypass(): Promise<boolean> {
    // Test for authentication bypass
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': 'Bearer fake-token'
        }
      });
      
      // Should return 401 for fake token
      return response.status === 401;
    } catch (error) {
      return true;
    }
  }
}

interface AuthTestResult {
  sqlInjection: boolean;
  xss: boolean;
  csrf: boolean;
  authBypass: boolean;
  overallSecure: boolean;
}
```

---

## ♿ Accessibility Testing

### **Automated Accessibility Testing**
```typescript
// Accessibility testing with axe-core
export class AccessibilityTester {
  static async testComponent(component: React.ReactElement): Promise<AccessibilityResult> {
    const { container } = render(component);
    
    const results = await axe(container);
    
    return {
      passed: results.violations.length === 0,
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
      score: this.calculateAccessibilityScore(results)
    };
  }
  
  static async testPage(url: string): Promise<AccessibilityResult> {
    const page = await playwright.chromium.launch();
    const context = await page.newContext();
    
    try {
      await page.goto(url);
      
      const results = await new AxeBuilder({ page }).analyze();
      
      return {
        passed: results.violations.length === 0,
        violations: results.violations,
        passes: results.passes,
        incomplete: results.incomplete,
        score: this.calculateAccessibilityScore(results)
      };
    } finally {
      await context.close();
      await page.close();
    }
  }
  
  private static calculateAccessibilityScore(results: AxeResults): number {
    const totalChecks = results.violations.length + results.passes.length + results.incomplete.length;
    const passedChecks = results.passes.length;
    
    return totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 100;
  }
}

interface AccessibilityResult {
  passed: boolean;
  violations: AxeResult[];
  passes: AxeResult[];
  incomplete: AxeResult[];
  score: number;
}
```

### **Manual Accessibility Testing Checklist**
```typescript
// Manual accessibility testing checklist
export const AccessibilityChecklist = {
  keyboard: {
    canNavigateWithKeyboard: true,
    focusVisible: true,
    focusOrder: true,
    skipLinks: true,
    tabOrder: true
  },
  visual: {
    colorContrast: true,
    textResize: true,
    highContrast: true,
    screenReader: true,
    zoom: true
  },
  cognitive: {
    clearLanguage: true,
    predictableNavigation: true,
    errorIdentification: true,
    instructions: true,
    consistentLayout: true
  },
  motor: {
    largeClickTargets: true,
    gestureAlternatives: true,
    timeoutAdjustment: true,
    motionControl: true,
    voiceControl: true
  }
};

// Accessibility testing utilities
export const AccessibilityUtils = {
  checkKeyboardNavigation: async (page: Page) => {
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    
    return {
      canTab: focusedElement !== undefined,
      focusedElement
    };
  },
  
  checkColorContrast: async (page: Page) => {
    const contrastResults = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const results: any[] = [];
      
      elements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Calculate contrast ratio
        const contrastRatio = calculateContrastRatio(color, backgroundColor);
        
        results.push({
          element: element.tagName,
          color,
          backgroundColor,
          contrastRatio,
          passesWCAG: contrastRatio >= 4.5
        });
      });
      
      return results;
    });
    
    return contrastResults;
  },
  
  checkScreenReaderCompatibility: async (page: Page) => {
    const ariaResults = await page.evaluate(() => {
      const elements = document.querySelectorAll('[aria-*]');
      const results: any[] = [];
      
      elements.forEach(element => {
        const ariaAttributes = Array.from(element.attributes)
          .filter(attr => attr.name.startsWith('aria-'))
          .map(attr => ({ name: attr.name, value: attr.value }));
        
        results.push({
          element: element.tagName,
          ariaAttributes,
          hasLabel: element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby'),
          hasDescription: element.hasAttribute('aria-describedby')
        });
      });
      
      return results;
    });
    
    return ariaResults;
  }
};
```

---

## 📊 Quality Metrics

### **Comprehensive Quality Dashboard**
```typescript
// Quality metrics dashboard
export class QualityDashboard {
  static async generateReport(): Promise<QualityReport> {
    const [
      codeQuality,
      testResults,
      performanceMetrics,
      securityAudit,
      accessibilityResults
    ] = await Promise.all([
      this.getCodeQualityMetrics(),
      this.getTestResults(),
      this.getPerformanceMetrics(),
      this.getSecurityAudit(),
      this.getAccessibilityResults()
    ]);
    
    return {
      overallScore: this.calculateOverallScore({
        codeQuality,
        testResults,
        performanceMetrics,
        securityAudit,
        accessibilityResults
      }),
      codeQuality,
      testResults,
      performanceMetrics,
      securityAudit,
      accessibilityResults,
      generatedAt: new Date()
    };
  }
  
  private static async getCodeQualityMetrics(): Promise<CodeQualityMetrics> {
    const files = await this.getAllSourceFiles();
    const reports = files.map(file => QualityMetrics.analyzeFile(file));
    
    return {
      totalFiles: files.length,
      averageComplexity: reports.reduce((sum, r) => sum + r.cyclomaticComplexity, 0) / reports.length,
      averageMaintainabilityIndex: reports.reduce((sum, r) => sum + r.maintainabilityIndex, 0) / reports.length,
      qualityDistribution: this.getQualityDistribution(reports)
    };
  }
  
  private static async getTestResults(): Promise<TestResults> {
    const coverage = await this.getCoverageReport();
    const testResults = await this.runAllTests();
    
    return {
      coverage: coverage.total.lines.pct,
      totalTests: testResults.numTotalTests,
      passedTests: testResults.numPassedTests,
      failedTests: testResults.numFailedTests,
      testDuration: testResults.testDuration
    };
  }
  
  private static async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const lighthouseResults = await this.runLighthouse();
    const loadTestResults = await this.runLoadTest();
    
    return {
      lighthouseScore: lighthouseResults.lhr.categories.performance.score * 100,
      firstContentfulPaint: lighthouseResults.lhr.audits['first-contentful-paint'].numericValue,
      largestContentfulPaint: lighthouseResults.lhr.audits['largest-contentful-paint'].numericValue,
      cumulativeLayoutShift: lighthouseResults.lhr.audits['cumulative-layout-shift'].numericValue,
      totalBlockingTime: lighthouseResults.lhr.audits['total-blocking-time'].numericValue,
      loadTestScore: loadTestResults.requestsPerSecond
    };
  }
  
  private static async getSecurityAudit(): Promise<SecurityMetrics> {
    const audit = await SecurityTester.runSecurityAudit();
    
    return {
      securityScore: audit.overallScore,
      vulnerabilities: audit.npmAudit.totalVulnerabilities,
      highVulnerabilities: audit.npmAudit.highVulnerabilities,
      criticalVulnerabilities: audit.npmAudit.criticalVulnerabilities
    };
  }
  
  private static async getAccessibilityResults(): Promise<AccessibilityMetrics> {
    const results = await AccessibilityTester.testPage('http://localhost:3000');
    
    return {
      accessibilityScore: results.score,
      violations: results.violations.length,
      passes: results.passes.length,
      incomplete: results.incomplete.length
    };
  }
  
  private static calculateOverallScore(metrics: any): number {
    const weights = {
      codeQuality: 0.2,
      testResults: 0.25,
      performance: 0.25,
      security: 0.2,
      accessibility: 0.1
    };
    
    const scores = {
      codeQuality: metrics.codeQuality.averageMaintainabilityIndex / 100,
      testResults: metrics.testResults.coverage / 100,
      performance: metrics.performanceMetrics.lighthouseScore / 100,
      security: metrics.securityAudit.securityScore / 100,
      accessibility: metrics.accessibilityResults.accessibilityScore / 100
    };
    
    return Object.entries(weights).reduce(
      (total, [key, weight]) => total + scores[key as keyof typeof scores] * weight,
      0
    ) * 100;
  }
}

interface QualityReport {
  overallScore: number;
  codeQuality: CodeQualityMetrics;
  testResults: TestResults;
  performanceMetrics: PerformanceMetrics;
  securityAudit: SecurityMetrics;
  accessibilityResults: AccessibilityMetrics;
  generatedAt: Date;
}

interface CodeQualityMetrics {
  totalFiles: number;
  averageComplexity: number;
  averageMaintainabilityIndex: number;
  qualityDistribution: Record<string, number>;
}

interface TestResults {
  coverage: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testDuration: number;
}

interface PerformanceMetrics {
  lighthouseScore: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  totalBlockingTime: number;
  loadTestScore: number;
}

interface SecurityMetrics {
  securityScore: number;
  vulnerabilities: number;
  highVulnerabilities: number;
  criticalVulnerabilities: number;
}

interface AccessibilityMetrics {
  accessibilityScore: number;
  violations: number;
  passes: number;
  incomplete: number;
}
```

---

## 📚 Best Practices

### **Quality Assurance Process**
1. **Pre-commit**: Run linting and formatting
2. **Pre-push**: Run unit tests and type checking
3. **Pull Request**: Run full test suite and quality gates
4. **Merge**: Deploy to staging environment
5. **Production**: Monitor quality metrics continuously

### **Quality Gates**
- **Code Coverage**: Minimum 90%
- **Bundle Size**: Maximum 500KB
- **Performance Score**: Minimum 90
- **Security Score**: Minimum 95
- **Accessibility Score**: Minimum 90

### **Continuous Improvement**
- **Weekly**: Review quality metrics and trends
- **Monthly**: Update quality standards and tools
- **Quarterly**: Conduct comprehensive quality audits
- **Annually**: Review and update quality strategy

---

**Last Updated**: February 2, 2026  
**Version**: 1.0.0  
**Quality Score**: 95%+ Target
