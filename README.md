# QuietSpace | Social Media without the distraction

## Overview

QuietSpace is a social media application designed for meaningful digital interactions through a simple interface. Built with modern web technologies, the platform focuses on user experience and demonstrates software engineering practices.

## Key Features

### User Experience
- **Secure Authentication**: User registration and login
- **Responsive Design**: Works on multiple device sizes
- **Dark Mode**: Theme switching with user preferences
- **Accessibility**: WCAG 2.1 AA compliance

### Communication Capabilities
- **Feed Management**: Create, edit, and delete posts with text, poll and image support
- **WebSocket Communication**: Real-time chat and notifications
- **Infinite Scrolling**: Efficient data loading using pagination
- **Real-time Updates**: Live feed updates and instant messaging

### Architecture
- **7-Layer Architecture**: Component → Hook → DI → Service → Data → Cache/Repository/WebSocket
- **Layer Separation**: Each layer has single responsibility
- **Dependency Injection**: Feature-specific containers
- **Modular Structure**: Standardized organization
- **Type-Safe Development**: TypeScript interfaces and typing

## Architecture Overview

### 7-Layer Architecture

The project implements clean architecture with layer separation:

```
Component Layer (Pure UI)
    ↓
Hook Layer (UI Logic + DI Access)
    ↓
DI Container (Dependency Resolution)
    ↓
Service Layer (Business Logic)
    ↓
Data Layer (Data Coordination)
    ↓
Cache Layer (Data Storage)
    ↓
Repository Layer (Data Access)
    ↓
WebSocket Layer (Real-time Communication)
```

**Layer Responsibilities:**
- **Component Layer**: UI rendering and local state only
- **Hook Layer**: UI logic, state transformation, DI container access
- **Service Layer**: Business logic, validation, data layer dependency only
- **Data Layer**: Data coordination between cache, repository, and WebSocket layers
- **Cache Layer**: Data storage and retrieval
- **Repository Layer**: Raw data access, external APIs
- **WebSocket Layer**: Real-time communication and event streaming

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
└── __tests__/       # Test suite
```

## Technology Stack

### Frontend Framework
- **React 19.0** with TypeScript 5.5
- **Vite 5.4**: Development server and builds
- **React Router DOM 6.4**: Client-side routing

### UI Components & Styling
- **Mantine UI 7.17**: Component library with forms, modals, and progress
- **React-JSS 10.9**: Dynamic styling with theming
- **Styled Components 6.3**: CSS-in-JS styling
- **React Icons 5.0**: Icon set

### State Management
- **Zustand 4.5**: State management
- **React Query 5.28**: Server state synchronization and caching
- **Context API**: Global state and theme management

### Real-Time Communication
- **SockJS Client 1.6**: WebSocket implementation
- **StompJS 2.3**: WebSocket messaging protocol

### Form Handling & Validation
- **Zod 3.23**: Runtime type checking and validation
- **Mantine Form 7.17**: Form management

### HTTP & Data Fetching
- **Axios 1.13**: HTTP client with interceptors
- **React Query**: Server state management and caching

### Utility Libraries
- **date-fns 4.1**: Date manipulation
- **Day.js 1.11**: Lightweight date utility
- **React Easy Emoji 1.8**: Emoji rendering
- **React Input Emoji 5.6**: Enhanced input interactions

### Testing & Quality Assurance
- **Jest 29.7**: Unit testing
- **Playwright 1.57**: E2E testing
- **Testing Library**: React testing utilities
- **ESLint 9.11**: Code quality with React compiler
- **TypeScript 5.5**: Strict typing

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
│   │       ├── domain/         # Business entities and interfaces
│   │       ├── data/           # Repository implementations
│   │       ├── application/    # Services and hooks
│   │       ├── presentation/   # UI components
│   │       └── di/             # DI container
│   ├── core/               # Shared core functionality
│   │   ├── auth/           # Core authentication providers
│   │   ├── cache/          # Enterprise caching system
│   │   ├── websocket/      # WebSocket management
│   │   ├── theme/          # Theme system and tokens
│   │   ├── di/             # Main DI container
│   │   └── network/        # Network system (Black Box)
│   ├── shared/             # Application-wide shared code
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Shared hooks
│   │   ├── utils/          # Utility functions
│   │   └── types/          # Shared types
│   └── app/                # Application-level code
├── docs/                  # Documentation
└── tests/                 # Test files
```

### Architecture Compliance

The project follows the **Component → Hook → DI → Service → Data → Cache/Repository/WebSocket** pattern:

- **Components** contain only UI logic
- **Hooks** provide UI logic with DI container access
- **Services** contain business logic with data layer dependency only
- **Data Layer** provides coordination between cache, repository, and WebSocket layers
- **Cache** layer handles data storage and retrieval
- **Repository** layer handles raw data access only
- **WebSocket** layer provides real-time communication

## Development Guidelines

### Layer Separation Rules

Follow strict layer separation in all development:

**Correct Patterns:**
- **Components** should only use hooks for UI logic and data access
- **Hooks** provide UI logic and access services through DI containers only
- **Services** contain business logic and depend only on the Data Layer
- **Data Layer** coordinates between cache, repository, and WebSocket layers

**Incorrect Patterns:**
- **Components** should not directly access services or repositories
- **Services** should not directly access cache, repository, or WebSocket layers
- Always follow the unidirectional dependency flow: Component → Hook → DI → Service → Data

### Code Quality Standards

- **TypeScript**: Strict mode with comprehensive types
- **ESLint**: React compiler integration with custom rules
- **Testing**: Unit and integration tests
- **Architecture**: Layer separation compliance

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
- Docker (optional)
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

## Documentation

Documentation is available in the `/docs` directory:

### Architecture & Development
- **ARCHITECTURE_OVERVIEW.md**: System architecture guide
- **DEVELOPER_ONBOARDING.md**: Developer setup and guidelines
- **MULTI_PLATFORM_STRATEGY.md**: Cross-platform development
- **SCALABILITY_GUIDELINES.md**: System scaling and performance
- **THEME_SYSTEM_GUIDE.md**: UI theming and customization
- **RESPONSIVE_DESIGN_GUIDE.md**: Mobile-first design principles
- **MODERNIZATION_REFACTORING_GUIDE.md**: Refactoring strategies

## Testing Strategy

### Test Coverage
- **Unit Tests**: Jest testing
- **Integration Tests**: Cross-feature workflows
- **E2E Tests**: User journey testing with Playwright
- **Performance Tests**: Load testing and benchmarks
- **Accessibility Tests**: WCAG 2.1 AA compliance

### Quality Gates
- Automated ESLint and TypeScript checks
- Pre-commit hooks for code quality
- CI/CD pipeline with testing
- Security scanning and vulnerability detection

## Contributing

We welcome contributions! Please follow our guidelines:

### Contribution Guidelines
- Follow existing code style and architecture patterns
- Write clear, commented code with TypeScript type safety
- Add/update tests for new functionality
- Run linting and type checking before submitting
- Update documentation for new features
- Follow the architecture principles
- Use the dependency injection system appropriately

### Development Workflow
1. Create feature branch from `main`
2. Implement changes following the feature structure
3. Add tests (unit, integration, E2E)
4. Update documentation
5. Submit pull request with detailed description

## Contact

Reach out via GitHub issues or discussions for any queries, bug reports, or feature requests.

## Project Status

**Status**: 🚧 In Development (v0.6 alpha)

This project is a social media platform currently in early development with:
- 7-layer architecture with data coordination
- Real-time communication and content management
- Testing framework
- Modern development toolchain
- Privacy-focused design with minimal distractions
- Dependency injection system
- Caching and real-time data integration

The system demonstrates modern software engineering practices and is actively being developed.

## License

This repository is licensed under the GNU Affero General Public License v3.0 (AGPLv3). This license requires that any modifications or distributions of the software, including commercial or proprietary use, must be made available under the same terms. Failure to comply with these terms may result in legal action.
