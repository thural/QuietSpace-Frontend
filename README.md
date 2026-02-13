# QuietSpace | Social Media without the distraction

## Overview

QuietSpace is a social media application designed for meaningful digital interactions through a simple interface. Built with modern web technologies, the platform focuses on user experience and demonstrates enterprise-grade software engineering practices with comprehensive core modules.

## Key Features

### User Experience
- **Secure Authentication**: Multi-factor authentication with rate limiting and security
- **Responsive Design**: Works seamlessly across all device sizes
- **Dark Mode**: Theme switching with WCAG accessibility compliance
- **Accessibility**: WCAG 2.1 AA compliance with high contrast and screen reader support
- **Plugin Architecture**: Extensible theming system with sandboxed plugins

### Communication Capabilities
- **Feed Management**: Create, edit, and delete posts with rich media support
- **WebSocket Communication**: Real-time chat with optimized connection management
- **Infinite Scrolling**: Efficient data loading with predictive caching
- **Real-time Updates**: Live feed updates and instant messaging with dependency management

### Advanced Architecture
- **7-Layer Architecture**: Component → Hook → DI → Service → Data → Cache/Repository/WebSocket
- **Layer Separation**: Each layer maintains single responsibility with clean interfaces
- **Dependency Injection**: Feature-specific containers with health monitoring
- **Modular Structure**: Standardized organization with comprehensive testing
- **Type-Safe Development**: TypeScript with strict typing and error handling
- **Performance Optimization**: Memory pooling, leak detection, and advanced caching strategies

## Architecture Overview

### 7-Layer Architecture

The project implements clean architecture with enterprise-grade layer separation:

```
Component Layer (Pure UI)
    ↓
Hook Layer (UI Logic + DI Access)
    ↓
DI Container (Dependency Resolution + Health Monitoring)
    ↓
Service Layer (Business Logic + Validation)
    ↓
Data Layer (Data Coordination + Performance Monitoring)
    ↓
Cache Layer (Advanced Caching + Memory Optimization)
    ↓
Repository Layer (Data Access + Input Validation)
    ↓
WebSocket Layer (Real-time Communication + Rate Limiting)
```

**Layer Responsibilities:**
- **Component Layer**: UI rendering and local state management only
- **Hook Layer**: UI logic, state transformation, DI container access with performance tracking
- **Service Layer**: Business logic, validation, data layer dependency with comprehensive error handling
- **Data Layer**: Data coordination between cache, repository, and WebSocket layers with performance metrics
- **Cache Layer**: Advanced caching with warming, predictive algorithms, and memory optimization
- **Repository Layer**: Data access with comprehensive input validation and security
- **WebSocket Layer**: Real-time communication with rate limiting and connection optimization

### Advanced Dependency Injection System

Feature-specific DI containers provide:
- **AuthContainer**: Authentication with MFA, rate limiting, and security monitoring
- **AnalyticsContainer**: Performance analytics and reporting with data aggregation
- **NotificationContainer**: Real-time notifications with priority queuing
- **ContentContainer**: Content management with validation and optimization
- **ThemeContainer**: UI theming with plugin architecture and accessibility features

### Core Modules Architecture

The project features a comprehensive core modules system at `src/core/modules/`:

```
src/core/modules/
├── authentication/     # Auth with MFA, rate limiting, security
├── caching/           # Advanced caching with warming, prediction, optimization
├── dependency-injection/ # DI containers with health monitoring
├── network/           # Network layer with validation, retry, error handling
├── theming/           # Theme system with plugins, accessibility
├── websocket/         # Real-time communication with optimization
├── error/             # Centralized error handling and reporting
└── logging/           # Comprehensive logging and performance tracking
```

### Feature Structure

Each feature follows standardized organization with enterprise patterns:
```
src/features/[feature]/
├── domain/          # Business logic and entities
├── data/            # Data access with validation and security
├── application/     # Use cases with error handling and monitoring
├── presentation/    # UI components with accessibility
├── di/              # Feature-specific DI container with health checks
└── __tests__/       # Comprehensive test suite with coverage
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
- **Jest 29.7**: Unit testing with comprehensive coverage
- **Playwright 1.57**: End-to-end testing with accessibility validation
- **Testing Library**: React testing utilities with component testing
- **ESLint 9.11**: Code quality with React compiler and strict rules
- **TypeScript 5.5**: Strict typing with comprehensive error handling

### Performance & Optimization
- **Advanced Caching**: Multi-layer caching with warming and prediction
- **Memory Management**: Object pooling, leak detection, and optimization
- **Bundle Optimization**: Code splitting and lazy loading strategies
- **Performance Monitoring**: Real-time performance metrics and analytics

### Security & Validation
- **Input Validation**: Comprehensive validation with XSS and SQL injection prevention
- **Rate Limiting**: Advanced rate limiting with progressive delays
- **Authentication Security**: MFA, session management, and threat detection
- **Content Security**: CSP headers and security policies

## Core Modules Documentation

### Comprehensive Module System

The project includes a comprehensive core modules system providing enterprise-grade functionality:

#### Authentication Module (`src/core/modules/authentication/`)
- **Multi-Factor Authentication**: TOTP, SMS, backup codes with unified orchestration
- **Security Features**: Rate limiting, session management, threat detection
- **Enterprise Patterns**: Service layer, repository pattern, dependency injection
- **Documentation**: Complete API reference and usage examples

#### Caching Module (`src/core/modules/caching/`)
- **Advanced Caching**: Cache warming, predictive algorithms, dependency management
- **Memory Optimization**: Object pooling, leak detection, garbage collection
- **Analytics Dashboard**: Real-time performance metrics and health monitoring
- **Enterprise Features**: Multi-provider support, configuration management

#### Network Module (`src/core/modules/network/`)
- **Input Validation**: Comprehensive validation with security measures
- **Error Handling**: Centralized error management with retry strategies
- **HTTP Client**: Advanced client with interceptors and validation middleware
- **Performance**: Connection pooling, request optimization, caching strategies

#### Theming Module (`src/core/modules/theming/`)
- **Plugin Architecture**: Extensible theming with sandboxed plugins
- **Accessibility**: WCAG 2.1 AA compliance with high contrast support
- **Theme Composition**: Advanced composition with inheritance and validation
- **Performance**: Optimized rendering with theme switching

#### WebSocket Module (`src/core/modules/websocket/`)
- **Connection Management**: Optimized connection handling with reconnection strategies
- **Cache Integration**: WebSocket cache manager with dependency management
- **Real-Time Updates**: Efficient event handling and message routing
- **Performance**: Connection pooling and optimization strategies

#### Error Module (`src/core/modules/error/`)
- **Centralized Error Handling**: Unified error management across all modules
- **Error Classification**: Comprehensive error categorization and handling
- **Error Reporting**: Detailed error tracking and analytics
- **Recovery Strategies**: Automatic error recovery with user feedback

## Project Structure

```
QuietSpace-Frontend/
│
├── public/                 # Static assets and entry point
│   ├── index.html
│   └── favicon.ico
│
├── src/                   # Application source code
│   ├── app/              # Application setup and routing
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature-specific implementations
│   │   ├── auth/         # Authentication feature
│   │   ├── feed/         # Feed management
│   │   ├── chat/         # Real-time chat
│   │   └── profile/      # User profile management
│   ├── core/             # Core modules and infrastructure
│   │   └── modules/       # Core module implementations
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # Global styles and themes
│   └── utils/            # Utility functions
│
├── docs/                  # Project documentation
│   ├── architecture/    # Architecture guides and patterns
│   ├── core-modules/     # Core modules documentation
│   └── api/             # API documentation
│
├── test/                  # Test files and configurations
│   ├── __tests__/       # Test suites
│   ├── e2e/           # End-to-end tests
│   └── components/     # Component tests
│
├── scripts/               # Build and development scripts
├── config/               # Configuration files
└── infrastructure/        # Deployment and infrastructure
```
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

### Enterprise Architecture Patterns

The project implements enterprise-grade architectural patterns:

#### Black Box Module Pattern
- **Clean Interfaces**: Each module exposes only well-defined public APIs
- **Hidden Implementation**: Internal details are completely hidden from consumers
- **Dependency Injection**: All dependencies are injected through containers
- **Single Responsibility**: Each module has a single, well-defined purpose

#### SOLID Principles
- **Single Responsibility**: Each class and module has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Derived classes can replace base classes
- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

#### Clean Architecture
- **Layer Separation**: Strict separation between architectural layers
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Business Logic Isolation**: Business logic is isolated from UI and infrastructure concerns
- **Testability**: All components are easily testable through dependency injection

### Code Quality Standards

- **TypeScript**: Strict mode with comprehensive error handling
- **ESLint**: React compiler integration with custom rules and strict configuration
- **Testing**: Comprehensive unit and integration tests with high coverage
- **Documentation**: Complete API documentation with usage examples
- **Performance**: Optimized rendering, caching, and memory management
- **Security**: Input validation, rate limiting, and threat detection

### Development Workflow

1. **Feature Development**: Follow standardized feature structure
2. **Code Review**: Architecture and code quality compliance
3. **Testing**: Unit, integration, and E2E testing
4. **Documentation**: Update relevant documentation
5. **Quality Assurance**: Automated checks and validation

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with ES2022+ support

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/QuietSpace-Frontend.git
cd QuietSpace-Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Run E2E tests
npm run test:e2e
```

## Documentation

### Architecture Documentation
- **Architecture Guide**: `docs/architecture/ARCHITECTURE_GUIDE.md`
- **Development Guidelines**: `docs/architecture/DEV_GUIDELINES.md`
- **Core Systems**: `docs/core-modules/CORE_SYSTEMS_GUIDE.md`

### API Documentation
- **Core Modules API**: `docs/api/`
- **Component Library**: Component documentation in storybook
- **Service APIs**: Service layer documentation

### Core Modules Reference
- **Authentication**: `docs/core-modules/authentication/`
- **Caching**: `docs/core-modules/caching/`
- **Network**: `docs/core-modules/network/`
- **Theming**: `docs/core-modules/theming/`
- **WebSocket**: `docs/core-modules/websocket/`

## Contributing

### Development Standards
- Follow the established architecture patterns
- Maintain strict layer separation
- Write comprehensive tests
- Update documentation
- Follow code quality standards

### Pull Request Process
1. Create feature branch from main
2. Implement changes following patterns
3. Add comprehensive tests
4. Update documentation
5. Submit pull request for review

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

Built with modern web technologies and enterprise-grade architectural patterns to demonstrate software engineering best practices.

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

# License Notice

**Proprietary Software – Strictly Limited to Educational Purposes Only – All Other Rights Reserved**

Copyright © 2026 Tural Musaibov. All rights reserved.

This software and all associated materials (the "Software") are the exclusive proprietary property of Tural Musaibov.

**Limited License Granted Solely for Educational Purposes**  
A narrow, revocable, non-transferable license is granted **only** for bona fide personal or institutional non-commercial educational use (e.g., learning, study, academic coursework, non-profit teaching/demos).  

**Mandatory Attribution**: Any use must prominently credit:  
"This work is based on proprietary software © 2026 Tural Musaibov. All rights reserved. Used under limited educational license only."

**All Other Uses Strictly Prohibited**  
No rights are granted for commercial, professional, production, deployment, modification, distribution, sale, or any non-educational purpose without my explicit prior written permission.

The Software is provided "AS IS" with no warranties. I disclaim all liability.

For any other use or permissions, contact:  
Tural Musaibov  
tural.musaibov@gmail.com  
LinkedIn: https://linkedin.com/in/tural-musaibov

# Third-Party License Notices

This project uses open-source third-party libraries under permissive licenses (primarily MIT, Apache-2.0, and BSD variants). Full license texts, copyright notices, and attributions for all production dependencies are available in:

- /third-party-licenses.txt (in the deployed app)  
- Or in the repository's `/public/third-party-licenses.txt` file.

All third-party code is used in compliance with their respective licenses. No copyleft obligations apply, and this project remains proprietary (see License Notice above).