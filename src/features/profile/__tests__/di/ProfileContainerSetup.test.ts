import { 
  initializeProfileContainer, 
  resetProfileContainer, 
  getProfileRepository 
} from "../../di";
import type { IProfileRepository } from "../../domain";
import { MockProfileRepository } from "../../data/MockProfileRepository";

describe("ProfileContainerSetup", () => {
  beforeEach(() => {
    resetProfileContainer();
  });

  it("should initialize with production repository by default", () => {
    initializeProfileContainer({ environment: "production" });
    
    const repo = getProfileRepository();
    expect(repo).toBeDefined();
    expect(repo.supportsFollowMutations).toBe(false); // Production repo does not support mutations yet
  });

  it("should initialize with mock repository when configured", () => {
    initializeProfileContainer({ useMockRepositories: true });
    
    const repo = getProfileRepository();
    expect(repo).toBeDefined();
    expect(repo.supportsFollowMutations).toBe(true); // Mock repo supports mutations
    expect(repo).toBeInstanceOf(MockProfileRepository);
  });

  it("should initialize with test environment when configured", () => {
    initializeProfileContainer({ environment: "test" });
    
    const repo = getProfileRepository();
    expect(repo).toBeDefined();
    expect(repo).toBeInstanceOf(MockProfileRepository); // Test env forces mock
  });

  it("should return singleton repository instance", () => {
    initializeProfileContainer();
    
    const repo1 = getProfileRepository();
    const repo2 = getProfileRepository();
    expect(repo1).toBe(repo2);
  });

  it("should reset cleanly", () => {
    initializeProfileContainer({ useMockRepositories: true });
    const repoBefore = getProfileRepository();
    
    resetProfileContainer();
    initializeProfileContainer({ environment: "production" });
    const repoAfter = getProfileRepository();
    
    expect(repoBefore).not.toBe(repoAfter);
    expect(repoBefore).toBeInstanceOf(MockProfileRepository);
    expect(repoAfter.supportsFollowMutations).toBe(false); // Back to production default
  });
});
