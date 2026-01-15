import { getProfileContainer, ProfileDependencies } from "./ProfileContainer";
import { createProfileRepository, createMockProfileRepository } from "../data/ProfileRepositoryFactory";
import type { IProfileRepository } from "../domain";

/**
 * Initialize and configure the ProfileContainer with default dependencies.
 *
 * This function should be called once at app startup (or in tests) to set up:
 * - Repository registration (mock vs real based on config)
 * - Optional: domain services, mappers, etc.
 */
export function initializeProfileContainer(options?: {
  useMockRepositories?: boolean;
  environment?: "production" | "test" | "development";
}): void {
  const container = getProfileContainer();

  const currentConfig = container.getConfig();
  const nextUseMock = options?.useMockRepositories ?? currentConfig.useMockRepositories;
  const nextEnv = options?.environment ?? currentConfig.environment;

  const shouldRebindRepository =
    !container.has(ProfileDependencies.REPOSITORY) ||
    currentConfig.useMockRepositories !== nextUseMock ||
    currentConfig.environment !== nextEnv;

  // Apply configuration
  container.configure({ useMockRepositories: nextUseMock, environment: nextEnv });

  if (!shouldRebindRepository) {
    return;
  }

  const config = container.getConfig();

  // Register repository based on configuration
  if (config.useMockRepositories || config.environment === "test") {
    container.registerSingleton<IProfileRepository>(
      ProfileDependencies.REPOSITORY,
      () => createMockProfileRepository()
    );
  } else {
    container.registerSingleton<IProfileRepository>(
      ProfileDependencies.REPOSITORY,
      // Explicitly override factory defaults (NODE_ENV=test would otherwise pick mocks)
      () => createProfileRepository({ useMockRepositories: false, environment: "production" })
    );
  }
}

/**
 * Reset the ProfileContainer (useful in test suites).
 */
export function resetProfileContainer(): void {
  const container = getProfileContainer();
  container.reset();
}

/**
 * Resolve the ProfileRepository from the container.
 *
 * Convenience wrapper to avoid importing the container and key everywhere.
 */
export function getProfileRepository(): IProfileRepository {
  const container = getProfileContainer();

  // Lazy initialization for safety when hooks resolve before app startup.
  if (!container.has(ProfileDependencies.REPOSITORY)) {
    initializeProfileContainer({
      environment: (process.env.NODE_ENV as any) || "production"
    });
  }

  return container.resolve<IProfileRepository>(ProfileDependencies.REPOSITORY);
}
