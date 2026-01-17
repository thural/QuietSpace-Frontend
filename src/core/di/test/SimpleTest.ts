import 'reflect-metadata';
import { Injectable, Container } from '../index';

// Simple test service
@Injectable({ lifetime: 'singleton' })
export class LoggerService {
  private counter = 0;

  increment(): number {
    return ++this.counter;
  }

  getCount(): number {
    return this.counter;
  }
}

// Test service
@Injectable({ lifetime: 'singleton' })
export class TestService {
  private counter = 0;

  increment(): number {
    return ++this.counter;
  }

  getCount(): number {
    return this.counter;
  }
}

// Test function
export function runSimpleTest() {
  console.log('🧪 Running Simple DI Test...');
  
  const container = Container.create();
  container.registerSingleton(TestService);
  
  const service = container.get(TestService);
  console.log('Count:', service.getCount());
  console.log('Increment:', service.increment());
  console.log('New count:', service.getCount());
  
  console.log('✅ Simple DI test completed!');
  return { container, service };
}
