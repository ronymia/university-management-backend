# University Management Backend (Monorepo)

Monorepo architecture hosting all backend microservices for the University Management System.

## Architecture

```text
university-management-backend/
├── services/
│   ├── api-gateway/       # API Gateway, reverse proxy & request aggregation (Port 3030)
│   ├── auth-service/      # Authentication, user & authorization service (Port 5000)
│   └── core-service/      # Academic departments, faculty, semesters, courses & enrollment (Port 5001)
├── package.json           # Root Yarn Workspaces orchestration
└── .gitignore             # Unified monorepo ignore rules
```

## Getting Started

### 1. Installation
Install all dependencies across the entire monorepo using Yarn Workspaces:
```bash
yarn install
```

### 2. Environment Configuration
Ensure each service has its respective `.env` configured inside `services/<service-name>/.env`.

### 3. Development Scripts
Run any service directly from the root workspace:

```bash
# Run API Gateway
yarn dev:gateway

# Run Auth Service
yarn dev:auth

# Run Core Service
yarn dev:core
```

### 4. Build Scripts
```bash
# Build all services
yarn build:all

# Or build individually
yarn build:gateway
yarn build:auth
yarn build:core
```
