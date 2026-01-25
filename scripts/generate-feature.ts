#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

// Feature generator script
const generateFeature = (featureName: string) => {
  const templates = {
    domainEntity: `export interface ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  // Add entity properties here
}`,

    domainService: `export interface I${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Service {
  // Define service methods here
}`,

    repository: `import 'reflect-metadata';
import { Injectable } from '../../../core/di';
import type { ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity } from '../domain';

@Injectable({ lifetime: 'singleton' })
export class ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Repository {
  private items = new Map<string, ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity>();

  async findById(id: string): Promise<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity | null> {
    return this.items.get(id) || null;
  }

  async save(item: ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity): Promise<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity> {
    this.items.set(item.id, item);
    return item;
  }

  async update(id: string, updates: Partial<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity>): Promise<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity> {
    const existing = this.items.get(id);
    if (!existing) {
      throw new Error(\`${featureName} \${id} not found\`);
    }
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.items.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async findAll(): Promise<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity[]> {
    return Array.from(this.items.values());
  }
}`,

    service: `import 'reflect-metadata';
import * as React from 'react';
import { Injectable, Inject, useService } from '../../../core/di';
import type { ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity } from '../domain';
import { ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Repository } from '../data';

@Injectable({ lifetime: 'singleton' })
export class ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Service {
  constructor(
    @Inject(${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Repository) private ${featureName}Repository: ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Repository
  ) {}

  async get${featureName.charAt(0).toUpperCase() + featureName.slice(1)}(id: string): Promise<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity | null> {
    return await this.${featureName}Repository.findById(id);
  }

  async create${featureName.charAt(0).toUpperCase() + featureName.slice(1)}(data: Omit<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity, 'id' | 'createdAt' | 'updatedAt'>): Promise<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity> {
    const newItem: ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return await this.${featureName}Repository.save(newItem);
  }

  async update${featureName.charAt(0).toUpperCase() + featureName.slice(1)}(id: string, updates: Partial<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity>): Promise<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity> {
    return await this.${featureName}Repository.update(id, updates);
  }

  async delete${featureName.charAt(0).toUpperCase() + featureName.slice(1)}(id: string): Promise<void> {
    await this.${featureName}Repository.delete(id);
  }

  async getAll${featureName.charAt(0).toUpperCase() + featureName.slice(1)}s(): Promise<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity[]> {
    return await this.${featureName}Repository.findAll();
  }
}

export const use${featureName.charAt(0).toUpperCase() + featureName.slice(1)}DI = () => {
  const ${featureName}Service = useService(${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Service);
  const [items, setItems] = React.useState<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await ${featureName}Service.getAll${featureName.charAt(0).toUpperCase() + featureName.slice(1)}s();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [${featureName}Service]);

  const createItem = React.useCallback(async (data: Omit<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newItem = await ${featureName}Service.create${featureName.charAt(0).toUpperCase() + featureName.slice(1)}(data);
      setItems(prev => [...prev, newItem]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item');
    }
  }, [${featureName}Service]);

  const updateItem = React.useCallback(async (id: string, updates: Partial<${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity>) => {
    try {
      const updatedItem = await ${featureName}Service.update${featureName.charAt(0).toUpperCase() + featureName.slice(1)}(id, updates);
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    }
  }, [${featureName}Service]);

  const deleteItem = React.useCallback(async (id: string) => {
    try {
      await ${featureName}Service.delete${featureName.charAt(0).toUpperCase() + featureName.slice(1)}(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  }, [${featureName}Service]);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem
  };
};`,

    component: `import * as React from 'react';
import { use${featureName.charAt(0).toUpperCase() + featureName.slice(1)}DI } from '../application/hooks/use${featureName.charAt(0).toUpperCase() + featureName.slice(1)}';
import { styles } from './${featureName}Component.styles';

export const ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Component: React.FC = () => {
  const { items, loading, error, createItem, updateItem, deleteItem } = use${featureName.charAt(0).toUpperCase() + featureName.slice(1)}DI();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h2>${featureName.charAt(0).toUpperCase() + featureName.slice(1)} Management</h2>
      <button onClick={() => createItem({ /* item data */ })}>
        Add ${featureName}
      </button>
      <div style={styles.list}>
        {items.map(item => (
          <div key={item.id} style={styles.item}>
            <h3>{item.id}</h3>
            <button onClick={() => updateItem(item.id, { /* updates */ })}>
              Edit
            </button>
            <button onClick={() => deleteItem(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};`,

    componentStyles: `import { CSSProperties } from 'react';

export const styles = {
  container: {
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  list: {
    marginTop: '16px'
  },
  item: {
    padding: '8px',
    border: '1px solid #e1e4e8',
    borderRadius: '4px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
} as const;`
  };

  const featureDir = path.join(process.cwd(), 'src', 'features', featureName);

  // Create directory structure
  const directories = [
    path.join(featureDir, 'domain'),
    path.join(featureDir, 'data'),
    path.join(featureDir, 'application', 'hooks'),
    path.join(featureDir, 'application', 'services'),
    path.join(featureDir, 'presentation', 'components')
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Write files
  fs.writeFileSync(path.join(featureDir, 'domain', 'index.ts'), `export type { ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Entity } from './${featureName}Entity';\n`);
  fs.writeFileSync(path.join(featureDir, 'domain', `${featureName}Entity.ts`), templates.domainEntity);
  fs.writeFileSync(path.join(featureDir, 'domain', 'index.ts'), templates.domainService);
  fs.writeFileSync(path.join(featureDir, 'data', `${featureName}Repository.ts`), templates.repository);
  fs.writeFileSync(path.join(featureDir, 'application', 'hooks', `use${featureName.charAt(0).toUpperCase() + featureName.slice(1)}.ts`), templates.service);
  fs.writeFileSync(path.join(featureDir, 'presentation', 'components', `${featureName}Component.tsx`), templates.component);
  fs.writeFileSync(path.join(featureDir, 'presentation', 'components', `${featureName}Component.styles.ts`), templates.componentStyles);

  console.log(`✅ Feature ${featureName} created successfully in ${featureDir}`);
};

// Get command line arguments
const args = process.argv.slice(2);
const featureName = args[0];

if (!featureName) {
  console.error('❌ Please provide a feature name');
  console.log('Usage: node generate-feature.js <FeatureName>');
  process.exit(1);
}

// Generate feature
generateFeature(featureName);
console.log(`🎉 Feature generation completed!`);
