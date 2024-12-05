# QuietSpace | Social Media without the distraction

## Overview

QuietSpace is a user-friendly, privacy-focused social media application designed for meaningful digital interactions through a minimalist and intuitive interface. Built with modern web technologies, the platform prioritizes user experience, performance, and developer extensibility.

## Key Features

### User Experience
- **Secure Authentication**: Robust, token-based user registration and login
- **Responsive Design**: Responsive UI supporting multiple device sizes
- **Dark Mode**: Intelligent theme switching with user preferences persistence

### Communication Capabilities
- **Feed Management**: Create, edit, and delete posts with text, poll and image support
- **WebSocket Communication**: Real-time chat and notifications, event-driven updates
- **Infinite Scrolling**: Efficient data loading using cursor-based pagination

## Authentication & Security Model

### Stateless JWT Authentication
- **Custom JWT Service**: Fully implemented token-based authentication
- **Access & Refresh Token Mechanism**:
  - Short-lived access tokens (typically 15-30 minutes)
  - Persistent refresh tokens for seamless user experience
  - Background token refresh without user intervention

## Technology Stack

### Frontend Framework
- **React 18.3** with TypeScript 5.5
- Modular component architecture
- Type-safe development

### State Management
- **Zustand**: Lightweight, flexible state management
- **React Query (TanStack Query v5)**: 
  - Server state synchronization
  - Caching and background updates
  - Infinite query and pagination support

### UI Components & Styling
- **Mantine UI v7.7**: Responsive component library
- **React-JSS**: Dynamic styling with prop-based theming

### Real-Time Communication
- **SockJS & StompJS**: 
  - WebSocket implementation
  - Secure messaging protocol
  - Fallback mechanisms for connectivity

### Form Handling & Validation
- **Zod**: 
  - Runtime type checking
  - Schema-based validation
  - Error handling with `zod-validation-error`

### Development & Build Tools
- **Vite 5.4**: 
  - Fast development server
  - Optimized production builds
  - Console output removal plugin
- **ESLint 9**: 
  - Strict code quality checks
  - React Hooks and Refresh plugins
  - TypeScript integration

### Utility Libraries
- **date-fns & Day.js**: Advanced date manipulation
- **React Icons**: Comprehensive icon set
- **React Input Emoji**: Enhanced input interactions
- **Fetch Intercept**: HTTP request/response interceptors

### Error Handling
- **React Error Boundary**: Graceful error management
- Component level crash isolation with retry option

## Project Structure

```
QuietSpace-Frontend/
│
├── public/             # Static assets and entry point
├── src/
│   ├── assets/         # Static media resources
│   ├── components/     # Reusable React components
│   │   ├── common/     # Generic UI components
│   │   └── feature/    # Feature-specific components
│   ├── services/       # API and WebSocket services
│   ├── pages/          # Route-based page components
│   ├── styles/         # Global styles and theme definitions
│   ├── utils/          # Utility functions and helpers
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Root application component
│   └── index.tsx       # Application entry point
│
├── docker/             # Docker configurations
├── tests/              # Unit and integration tests
└── config/             # Build and environment configurations
```

## Key Development Scripts

```json
{
  "dev": "vite --port 5000",
  "build": "tsc -b && vite build",
  "test": "jest",
  "lint": "eslint .",
  "serve-json": "json-server --watch db.json --port 4000"
}
```

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm 9+ or Yarn
- Docker (optional, for containerized development)

### Local Development

1. Clone the repository
```bash
git clone https://github.com/thural/QuietSpace.git
cd QuietSpace
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start development server
```bash
npm run dev
# or 
yarn dev
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

## Contributing

We welcome contributions! Please follow basic guidlines:

### Contribution Guidelines
- Follow existing code style
- Write clear, commented code
- Ensure TypeScript type safety
- Add/update tests for new functionality
- Run linting before submitting

## Contact

Reach out via GitHub issues or discussions for any queries, bug reports, or feature requests.

# License Notice

This repository is licensed under the GNU Affero General Public License v3.0 (AGPLv3). This license requires that any modifications or distributions of the software, including commercial or proprietary use, must be made available under the same terms. Failure to comply with these terms may result in legal action.
