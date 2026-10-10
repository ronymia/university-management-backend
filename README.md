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
Run all services simultaneously or individually from the root directory:

```bash
# Run ALL services concurrently (API Gateway, Auth, Core)
yarn dev:all
# or simply
yarn dev

# Run individual services
yarn dev:gateway
yarn dev:auth
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
