#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const process = require('process');

// Component generator script
const generateComponent = (componentName, feature = 'shared') => {
  const templates = {
    component: `import * as React from 'react';
import { useService } from '../../core/di';
import { styles } from './${componentName}.styles';

interface ${componentName}Props {
  // Define component props here
}

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  // Add DI service usage if needed
  // const service = useService(ServiceName);
  
  return (
    <div style={styles.container}>
      <h2>${componentName} Component</h2>
      <p>Component implementation goes here</p>
    </div>
  );
};

export default ${componentName};`,

    styles: `import { CSSProperties } from 'react';

export const styles = {
  container: {
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px'
  }
} as const;`,

    test: `import { render, screen } from '@testing-library/react';
import { ${componentName} } from '../${componentName}';
import { renderWithDI } from '../../../shared/utils/testUtils';

describe('${componentName}', () => {
  it('should render component', () => {
    renderWithDI(<${componentName} />);
    
    expect(screen.getByText('${componentName} Component')).toBeInTheDocument();
  });

  it('should handle props correctly', () => {
    const props = {
      // Add test props here
    };
    
    renderWithDI(<${componentName} {...props} />);
    
    // Add assertions here
  });
});`,

    index: `export { ${componentName} } from './${componentName}';
export { styles } from './${componentName}.styles';`
  };

  const componentDir = path.join(process.cwd(), 'src', 'features', feature, 'presentation', 'components', componentName);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  // Write files
  fs.writeFileSync(path.join(componentDir, `${componentName}.tsx`), templates.component);
  fs.writeFileSync(path.join(componentDir, `${componentName}.styles.ts`), templates.styles);
  fs.writeFileSync(path.join(componentDir, `${componentName}.test.tsx`), templates.test);
  fs.writeFileSync(path.join(componentDir, 'index.ts'), templates.index);

  console.log(`✅ Component ${componentName} created successfully in ${componentDir}`);
};

// Get command line arguments
const args = process.argv.slice(2);
const componentName = args[0];
const feature = args[1] || 'shared';

if (!componentName) {
  console.error('❌ Please provide a component name');
  console.log('Usage: node generate-component.js <ComponentName> [feature]');
  process.exit(1);
}

// Generate component
generateComponent(componentName, feature);
console.log(`🎉 Component generation completed!`);
