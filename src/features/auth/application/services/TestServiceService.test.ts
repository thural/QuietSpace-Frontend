import { Container } from '../../../core/di';
import { TestServiceService, TestServiceRepository } from '../services/TestServiceServiceDI';

describe('TestServiceService', () => {
  let container: Container;

  beforeEach(() => {
    container = Container.create();
    container.registerSingleton(TestServiceRepository);
    container.registerSingleton(TestServiceService);
  });

  it('should register service', () => {
    const service = container.resolve(TestServiceService);
    expect(service).toBeInstanceOf(TestServiceService);
  });

  it('should resolve dependencies', () => {
    const service = container.resolve(TestServiceService);
    expect(service).toBeDefined();
  });
});