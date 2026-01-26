# QuietSpace | Social Media without the distraction

## Overview

QuietSpace is a user-friendly, privacy-focused social media application designed for meaningful digital interactions through a minimalist and intuitive interface. Built with modern web technologies and enterprise-grade architecture, the platform prioritizes user experience, performance, and developer extensibility while demonstrating advanced software engineering practices.

## Key Features

### User Experience
- **Secure Authentication**: Robust, token-based user registration and login
- **Responsive Design**: Responsive UI supporting multiple device sizes
- **Dark Mode**: Intelligent theme switching with user preferences persistence
- **Accessibility**: WCAG 2.1 AA compliance with comprehensive testing

### Communication Capabilities
- **Feed Management**: Create, edit, and delete posts with text, poll and image support
- **WebSocket Communication**: Real-time chat and notifications, event-driven updates
- **Infinite Scrolling**: Efficient data loading using cursor-based pagination
- **Real-time Updates**: Live feed updates and instant messaging

### Enterprise Architecture
- **4-Layer Clean Architecture**: Domain, Data, Application, and Presentation layers
- **Dependency Injection System**: Feature-specific containers with enterprise-grade DI
- **Modular Feature Structure**: Standardized organization with cross-platform support
- **Type-Safe Development**: Comprehensive TypeScript interfaces and strict typing
- **Black Box Module Pattern**: Complete isolation and encapsulation of infrastructure modules
- **Enterprise Hook Pattern**: Comprehensive functionality with caching and performance optimization
- **Service Layer Pattern**: Business logic orchestration with validation and cross-service coordination
- **Repository Pattern**: Clean data access abstraction with caching and error handling

## Architecture Overview

### 4-Layer Clean Architecture

The project implements enterprise-grade clean architecture with clear separation of concerns:

- **Domain Layer**: Core business logic and entities
- **Data Layer**: Data access, storage, and external service integration
- **Application Layer**: Use cases and business rules orchestration
- **Presentation Layer**: UI components and user interaction handling

### Dependency Injection System

Feature-specific DI containers provide:
- AuthContainer: Authentication and authorization services
- AnalyticsContainer: Analytics and reporting services
- NotificationContainer: Real-time notification management
- ContentContainer: Content management and delivery
- ThemeContainer: UI theming and personalization

### Feature Structure

Each feature follows standardized organization:
```
src/features/[feature]/
├── domain/          # Business logic and entities
├── data/            # Data access and external APIs
├── application/     # Use cases and business rules
├── presentation/    # UI components and pages
├── di/              # Feature-specific DI container
└── __tests__/       # Comprehensive test suite
```

## Technology Stack

### Frontend Framework
- **React 19.0** with TypeScript 5.5
- **Vite 5.4**: Fast development server and optimized builds
- **React Router DOM 6.4**: Client-side routing with lazy loading

### UI Components & Styling
- **Mantine UI 7.17**: Modern component library with dates, forms, modals, and progress
- **React-JSS 10.9**: Dynamic styling with prop-based theming
- **Styled Components 6.3**: CSS-in-JS styling solution
- **React Icons 5.0**: Comprehensive icon set
- **Emotion 11.14**: CSS-in-JS library for component styling

### State Management
- **Zustand 4.5**: Lightweight state management
- **React Query 5.28**: Server state synchronization and caching with devtools
- **Context API**: Global state and theme management

### Real-Time Communication
- **SockJS Client 1.6**: WebSocket implementation with fallbacks
- **StompJS 2.3**: WebSocket messaging protocol

### Form Handling & Validation
- **Zod 3.23**: Runtime type checking and schema-based validation
- **Zod Validation Error 3.4**: Enhanced error handling
- **Mantine Form 7.17**: Integrated form management

### HTTP & Data Fetching
- **Axios 1.13**: HTTP client with interceptors
- **Fetch Intercept 2.4**: HTTP request/response interceptors
- **React Query**: Server state management and caching

### Utility Libraries
- **date-fns 4.1**: Modern date manipulation
- **Day.js 1.11**: Lightweight date utility
- **React Easy Emoji 1.8**: Emoji rendering
- **React Input Emoji 5.6**: Enhanced input interactions

### Testing & Quality Assurance
- **Jest 29.7**: Unit testing with experimental VM modules
- **Playwright 1.57**: E2E testing with cross-browser support
- **Testing Library**: React testing utilities and user event simulation
- **ESLint 9.11**: Code quality with React compiler and hooks plugins
- **TypeScript 5.5**: Strict typing with comprehensive interfaces

### Development & Build Tools
- **Vite 5.4**: Fast development and optimized production builds
- **TypeScript 5.5**: Type-safe development
- **ESLint**: Code quality and React compiler integration
- **PostCSS**: CSS processing with Mantine preset
- **Babel**: JavaScript transpilation with React compiler support

## Project Structure

```
QuietSpace-Frontend/
│
├── public/                 # Static assets and entry point
├── src/
│   ├── features/           # Modular feature architecture
│   │   ├── auth/           # Authentication system
│   │   ├── content/        # Content management and feed
│   │   ├── notifications/  # Real-time notifications
│   │   ├── theme/          # UI theming system
│   │   └── # Each feature contains:
│   │       ├── domain/         # Business logic
│   │       ├── data/           # Data access
│   │       ├── application/    # Use cases
│   │       ├── presentation/   # UI components
│   │       ├── di/             # DI container
│   │       └── __tests__/      # Test suite
│   │
│   ├── components/          # Shared UI components
│   │   ├── common/          # Generic components
│   │   └── layout/          # Layout components
│   ├── services/            # Global services and utilities
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── constants/           # Application constants
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Root application component
│   └── index.tsx            # Application entry point
│
├── docs/                    # Comprehensive documentation
│   ├── ARCHITECTURE_OVERVIEW.md
│   ├── DEVELOPER_ONBOARDING.md
│   └── # 7 total documentation files
│
├── test/                    # Integration and E2E tests
├── docker/                  # Docker configurations
├── scripts/                 # Build and utility scripts
└── config/                  # Build and environment configs
```

## Key Development Scripts

```json
{
  "dev": "vite --port 5000",
  "build": "tsc -b && vite build",
  "test": "NODE_OPTIONS=--experimental-vm-modules jest",
  "test:watch": "NODE_OPTIONS=--experimental-vm-modules jest --watch",
  "test:coverage": "NODE_OPTIONS=--experimental-vm-modules jest --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:headed": "playwright test --headed",
  "lint": "eslint .",
  "preview": "vite preview",
  "serve-json": "json-server --watch db.json --port 4000"
}
```

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm 9+ or Yarn
- Docker (optional, for containerized development)
- Playwright browsers (for E2E testing)

### Local Development

1. Clone the repository
```bash
git clone https://github.com/thural/QuietSpace-Frontend.git
cd QuietSpace-Frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Install Playwright browsers (for E2E testing)
```bash
npx playwright install
```

4. Start development server
```bash
npm run dev
# or 
yarn dev
```

5. Run tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# All tests with coverage
npm run test:coverage
```

### Docker Deployment

```bash
docker-compose up --build
```

## Licensing

**GNU Affero General Public License v3.0 (AGPL-3.0)**

This project is openly licensed under AGPL-3.0, ensuring:
- Complete source code transparency
- Mandatory sharing of modifications
- Protection of user freedoms

## Documentation

Comprehensive documentation is available in the `/docs` directory:

### Architecture & Development
- **ARCHITECTURE_OVERVIEW.md**: Complete system architecture guide
- **DEVELOPER_ONBOARDING.md**: New developer setup and guidelines
- **MULTI_PLATFORM_STRATEGY.md**: Cross-platform development approach
- **SCALABILITY_GUIDELINES.md**: System scaling and performance
- **THEME_SYSTEM_GUIDE.md**: UI theming and customization
- **RESPONSIVE_DESIGN_GUIDE.md**: Mobile-first design principles
- **MODERNIZATION_REFACTORING_GUIDE.md**: Refactoring strategies

## Performance Metrics

### Frontend Performance
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms

### System Performance
- API Response Time < 200ms (95th percentile)
- Database Query Time < 100ms (average)
- Cache Hit Rate > 85%
- Error Rate < 1%

## Testing Strategy

### Test Coverage
- **Unit Tests**: 90%+ coverage with Jest
- **Integration Tests**: Cross-feature workflows
- **E2E Tests**: User journey testing with Playwright
- **Performance Tests**: Load testing and benchmarks
- **Accessibility Tests**: WCAG 2.1 AA compliance

### Quality Gates
- Automated ESLint and TypeScript checks
- Pre-commit hooks for code quality
- CI/CD pipeline with comprehensive testing
- Security scanning and vulnerability detection

## Contributing

We welcome contributions! Please follow our comprehensive guidelines:

### Contribution Guidelines
- Follow existing code style and architecture patterns
- Write clear, commented code with TypeScript type safety
- Add/update tests for new functionality (90%+ coverage required)
- Run linting and type checking before submitting
- Update documentation for new features
- Follow the 4-layer architecture principles
- Use the dependency injection system appropriately

### Development Workflow
1. Create feature branch from `main`
2. Implement changes following the feature structure
3. Add comprehensive tests (unit, integration, E2E)
4. Update documentation
5. Submit pull request with detailed description

## Contact

Reach out via GitHub issues or discussions for any queries, bug reports, or feature requests.

## Project Status

**Status**: 🚧 In Development

This project represents a modern social media platform currently in development with:
- Advanced 4-layer clean architecture
- Real-time communication and content management
- Comprehensive testing framework
- Modern development toolchain
- Privacy-focused design with minimal distractions

The system demonstrates modern software engineering practices and is actively being developed for production deployment.

# License Notice

This repository is licensed under the GNU Affero General Public License v3.0 (AGPLv3). This license requires that any modifications or distributions of the software, including commercial or proprietary use, must be made available under the same terms. Failure to comply with these terms may result in legal action.
