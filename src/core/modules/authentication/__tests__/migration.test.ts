/**
 * Authentication Migration Test
 *
 * Test to verify the SOLID architecture migration is working correctly
 */

import { describe, it, expect } from '@jest/globals';

import { createDefaultAuthOrchestrator } from '../factory';

describe('Authentication Migration Test', () => {
    it('should create SOLID auth orchestrator successfully', () => {
        const orchestrator = createDefaultAuthOrchestrator();

        expect(orchestrator).toBeDefined();
        expect(orchestrator.getCapabilities()).toContain('authentication');
        expect(orchestrator.getCapabilities()).toContain('validation');
        expect(orchestrator.getCapabilities()).toContain('provider_management');
    });

    it('should have SOLID capabilities', () => {
        const orchestrator = createDefaultAuthOrchestrator();
        const capabilities = orchestrator.getCapabilities();

        // Verify SOLID architecture capabilities
        expect(capabilities).toContain('authentication');
        expect(capabilities).toContain('provider_management');
        expect(capabilities).toContain('validation');
        expect(capabilities).toContain('security');
        expect(capabilities).toContain('logging');
        expect(capabilities).toContain('metrics');
    });

    it('should initialize successfully', async () => {
        const orchestrator = createDefaultAuthOrchestrator();

        // Test that the orchestrator can initialize without errors
        await expect(orchestrator.initialize()).resolves.not.toThrow();
    });
});
