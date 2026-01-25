import { Container } from '../../../core/di';
import { AnotherServiceService, AnotherServiceRepository } from '../services/AnotherServiceServiceDI';

describe('AnotherServiceService', () => {
  let container: Container;

  beforeEach(() => {
    container = Container.create();
    container.registerSingleton(AnotherServiceRepository);
    container.registerSingleton(AnotherServiceService);
  });

  it('should register service', () => {
    const service = container.resolve(AnotherServiceService);
    expect(service).toBeInstanceOf(AnotherServiceService);
  });

  it('should resolve dependencies', () => {
    const service = container.resolve(AnotherServiceService);
    expect(service).toBeDefined();
  });
});