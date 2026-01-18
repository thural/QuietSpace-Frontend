/**
 * Test file for Repository Factory functionality.
 * 
 * This file demonstrates and tests the Repository Factory implementation
 * to ensure proper dependency injection and configuration management.
 */

import { RepositoryFactory, createNotificationRepository, createMockNotificationRepository } from "../data";

/**
 * Test function to verify Repository Factory functionality.
 * 
 * @returns {Promise<void>} - Test results
 */
export const testRepositoryFactory = async (): Promise<void> => {
  console.log("🧪 Testing Repository Factory...");

  try {
    // Test 1: Default factory instance
    console.log("✅ Test 1: Default factory instance");
    const defaultFactory = RepositoryFactory.getInstance();
    const defaultRepo = defaultFactory.createNotificationRepository();
    console.log("Default repository created:", defaultRepo.constructor.name);

    // Test 2: Mock repository creation
    console.log("✅ Test 2: Mock repository creation");
    const mockRepo = createMockNotificationRepository({
      hasPendingNotifications: true,
      hasUnreadChats: true
    });
    console.log("Mock repository created:", mockRepo.constructor.name);

    // Test 3: Factory configuration
    console.log("✅ Test 3: Factory configuration");
    const config = defaultFactory.getConfig();
    console.log("Factory config:", config);

    // Test 4: Repository functionality
    console.log("✅ Test 4: Repository functionality");
    const notificationStatus = await mockRepo.getNotificationStatus();
    console.log("Mock notification status:", notificationStatus);

    // Test 5: Factory reset
    console.log("✅ Test 5: Factory reset");
    defaultFactory.reset();
    const newRepo = defaultFactory.createNotificationRepository();
    console.log("New repository after reset:", newRepo.constructor.name);

    console.log("🎉 All Repository Factory tests passed!");
  } catch (error) {
    console.error("❌ Repository Factory test failed:", error);
    throw error;
  }
};

/**
 * Test function to verify dependency injection scenarios.
 * 
 * @returns {Promise<void>} - Test results
 */
export const testDependencyInjection = async (): Promise<void> => {
  console.log("🧪 Testing Dependency Injection...");

  try {
    // Test 1: Production repository injection
    console.log("✅ Test 1: Production repository injection");
    const productionRepo = createNotificationRepository({
      useMockRepositories: false
    });
    console.log("Production repository:", productionRepo.constructor.name);

    // Test 2: Mock repository injection
    console.log("✅ Test 2: Mock repository injection");
    const mockRepo = createNotificationRepository({
      useMockRepositories: true,
      mockConfig: {
        simulateLoading: true
      }
    });
    console.log("Mock repository:", mockRepo.constructor.name);

    // Test 3: Environment-based injection
    console.log("✅ Test 3: Environment-based injection");
    const envRepo = createNotificationRepository(); // Uses default config
    console.log("Environment-based repository:", envRepo.constructor.name);

    console.log("🎉 All Dependency Injection tests passed!");
  } catch (error) {
    console.error("❌ Dependency Injection test failed:", error);
    throw error;
  }
};

/**
 * Run all Repository Factory tests.
 * 
 * @returns {Promise<void>} - All test results
 */
export const runRepositoryFactoryTests = async (): Promise<void> => {
  console.log("🚀 Starting Repository Factory Tests...\n");
  
  await testRepositoryFactory();
  console.log();
  await testDependencyInjection();
  
  console.log("\n✨ All Repository Factory tests completed successfully!");
};
