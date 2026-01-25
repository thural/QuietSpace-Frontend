#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

// Service generator script
const generateService = (serviceName: string, feature: string) => {
  const templates = {
    service: `import 'reflect-metadata';
import * as React from 'react';
import { Injectable, Inject, useService } from '../../../core/di';

// Service interfaces
interface I${serviceName}Service {
  // Define service methods here
}

interface I${serviceName}Repository {
  // Define repository methods here
}

// Mock repository implementation
@Injectable({ lifetime: 'singleton' })
export class ${serviceName}Repository implements I${serviceName}Repository {
  // Implement repository methods here
}

// DI-enabled Service
@Injectable({ lifetime: 'singleton' })
export class ${serviceName}Service implements I${serviceName}Service {
  constructor(
    @Inject(${serviceName}Repository) private ${serviceName.toLowerCase()}Repository: I${serviceName}Repository
  ) {}

  // Implement service methods here
}

// DI-enabled Hook
export const use${serviceName}DI = () => {
  const ${serviceName.toLowerCase()}Service = useService(${serviceName}Service);
  
  // Add state management here
  
  return {
    ${serviceName.toLowerCase()}Service,
    // Return hook interface here
  };
};`,

    test: `import { Container } from '../../../core/di';
import { ${serviceName}Service, ${serviceName}Repository } from '../services/${serviceName}ServiceDI';

describe('${serviceName}Service', () => {
  let container: Container;

  beforeEach(() => {
    container = Container.create();
    container.registerSingleton(${serviceName}Repository);
    container.registerSingleton(${serviceName}Service);
  });

  it('should register service', () => {
    const service = container.resolve(${serviceName}Service);
    expect(service).toBeInstanceOf(${serviceName}Service);
  });

  it('should resolve dependencies', () => {
    const service = container.resolve(${serviceName}Service);
    expect(service).toBeDefined();
  });
});`,

    index: `export { ${serviceName}Service, ${serviceName}Repository, use${serviceName}DI } from './${serviceName}ServiceDI';`
  };

  const serviceDir = path.join(process.cwd(), 'src', 'features', feature, 'application', 'services');

  // Create directory if it doesn't exist
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }

  // Write files
  fs.writeFileSync(path.join(serviceDir, `${serviceName}ServiceDI.ts`), templates.service);
  fs.writeFileSync(path.join(serviceDir, `${serviceName}Service.test.ts`), templates.test);
  fs.writeFileSync(path.join(serviceDir, 'index.ts'), templates.index);

  console.log(`✅ Service ${serviceName} created successfully in ${serviceDir}`);
};

// Get command line arguments
const args = process.argv.slice(2);
const serviceName = args[0];
const feature = args[1];

if (!serviceName || !feature) {
  console.error('❌ Please provide service name and feature');
  console.log('Usage: node generate-service.js <ServiceName> <feature>');
  process.exit(1);
}

// Generate service
generateService(serviceName, feature);
console.log(`🎉 Service generation completed!`);
