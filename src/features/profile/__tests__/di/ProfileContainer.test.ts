import { getProfileContainer, ProfileDependencies } from "../../di";
import type { IProfileRepository } from "../../domain";
import { MockProfileRepository } from "../../data/MockProfileRepository";

describe("ProfileContainer (DI)", () => {
  beforeEach(() => {
    getProfileContainer().reset();
  });

  it("should resolve a registered dependency", () => {
    const container = getProfileContainer();
    const mockRepo = new MockProfileRepository();
    
    container.registerSingleton(ProfileDependencies.REPOSITORY, () => mockRepo);
    
    const resolved = container.resolve<IProfileRepository>(ProfileDependencies.REPOSITORY);
    expect(resolved).toBe(mockRepo);
  });

  it("should throw when resolving unregistered dependency", () => {
    const container = getProfileContainer();
    
    expect(() => container.resolve("NonExistent")).toThrow(
      "Dependency 'NonExistent' not registered in ProfileContainer"
    );
  });

  it("should support configuration", () => {
    const container = getProfileContainer();
    
    container.configure({ useMockRepositories: true, environment: "test" });
    
    const config = container.getConfig();
    expect(config.useMockRepositories).toBe(true);
    expect(config.environment).toBe("test");
  });

  it("should reset cleanly", () => {
    const container = getProfileContainer();
    
    container.register(ProfileDependencies.REPOSITORY, () => new MockProfileRepository());
    container.configure({ useMockRepositories: true });
    
    expect(container.has(ProfileDependencies.REPOSITORY)).toBe(true);
    expect(container.getConfig().useMockRepositories).toBe(true);
    
    container.reset();
    
    expect(container.has(ProfileDependencies.REPOSITORY)).toBe(false);
    expect(container.getConfig().useMockRepositories).toBe(false);
    expect(container.getConfig().environment).toBe("production");
  });
});
