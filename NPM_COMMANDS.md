# NPM Commands Reference

Quick reference for all available npm commands in the AI Judge project.

---

## 🚀 Quick Start Commands

```bash
# One-command setup (installs all dependencies)
npm run install:all

# Start both frontend and backend together
npm run dev

# Run all tests
npm test
```

---

## 📦 Installation Commands

```bash
# Install root dependencies
npm install

# Install all workspace dependencies (frontend + backend)
npm run install:all

# Install frontend dependencies only
cd frontend && npm install

# Install backend dependencies only
cd backend && npm install

# Clean install (removes node_modules first)
npm clean-install
```

---

## 🏃 Development Commands

### Run Both Services

```bash
# Start frontend and backend concurrently (recommended)
npm run dev
```

This will start:
- Backend on http://localhost:5000
- Frontend on http://localhost:5173

### Run Services Separately

```bash
# Start backend only (from root)
npm run dev:backend

# Start frontend only (from root)
npm run dev:frontend

# Or navigate to each directory
cd backend && npm run dev
cd frontend && npm run dev
```

---

## 🏗️ Build Commands

```bash
# Build both frontend and backend
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend

# From specific directories
cd frontend && npm run build
cd backend && npm run build
```

**Output:**
- Frontend: `frontend/dist/`
- Backend: `backend/dist/` (if using TypeScript)

---

## 🧪 Testing Commands

```bash
# Run all tests (frontend + backend)
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend

# Run tests in watch mode
cd backend && npm run test:watch
cd frontend && npm run test:watch

# Run tests with coverage
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
```

---

## 🐳 Docker Commands

```bash
# Build Docker images
npm run docker:build
# or
docker-compose build

# Start all containers
npm run docker:up
# or
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop all containers
npm run docker:down
# or
docker-compose down

# View logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# Rebuild and start
docker-compose up --build

# Remove volumes as well
docker-compose down -v
```

---

## 🧹 Cleanup Commands

```bash
# Remove node_modules from all workspaces
rm -rf node_modules frontend/node_modules backend/node_modules

# Remove build artifacts
rm -rf frontend/dist backend/dist

# Remove uploaded files (be careful!)
rm -rf backend/uploads/*

# Clean npm cache
npm cache clean --force

# Complete cleanup (nuclear option)
rm -rf node_modules frontend/node_modules backend/node_modules
rm -rf frontend/dist backend/dist
rm -rf backend/uploads/*
npm cache clean --force
```

---

## 📋 Useful Backend Commands

```bash
# Navigate to backend
cd backend

# Start development server with hot reload
npm run dev

# Run specific test file
npm test -- case.test.js

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Check for outdated packages
npm outdated
```

---

## 🎨 Useful Frontend Commands

```bash
# Navigate to frontend
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

---

## 🔍 Debugging Commands

### Backend Debugging

```bash
# Start backend with Node inspector
cd backend
node --inspect src/index.js

# Or with nodemon
npm run dev:debug
```

### Frontend Debugging

```bash
# Start with source maps (already enabled in dev)
cd frontend
npm run dev

# Build with source maps for production debugging
npm run build -- --sourcemap
```

---

## 📊 Package Management

```bash
# Add a dependency to root
npm install <package-name>

# Add dependency to frontend
cd frontend && npm install <package-name>

# Add dependency to backend
cd backend && npm install <package-name>

# Add dev dependency
npm install --save-dev <package-name>

# Remove a dependency
npm uninstall <package-name>

# Update all dependencies
npm update

# Update specific package
npm update <package-name>

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# List installed packages
npm list

# List outdated packages
npm outdated
```

---

## 🔧 Configuration Commands

### Environment Setup

```bash
# Create .env from example
cp .env.example .env

# Create frontend .env
cp frontend/.env.example frontend/.env

# Edit .env (Windows)
notepad .env

# Edit .env (Mac/Linux)
nano .env
# or
vim .env
```

---

## 📝 Logging & Monitoring

```bash
# View backend logs (if running in Docker)
docker-compose logs backend

# Follow backend logs
docker-compose logs -f backend

# View frontend logs
docker-compose logs frontend

# View all logs
docker-compose logs -f

# Clear terminal
clear  # Unix
cls    # Windows
```

---

## 🚢 Production Commands

### Backend Production

```bash
cd backend

# Set production environment
export NODE_ENV=production  # Unix
set NODE_ENV=production     # Windows

# Start production server
npm start

# Or with PM2
pm2 start src/index.js --name ai-judge-backend
pm2 logs ai-judge-backend
pm2 stop ai-judge-backend
pm2 restart ai-judge-backend
```

### Frontend Production

```bash
cd frontend

# Build for production
npm run build

# Serve with a static server
npx serve -s dist -p 3000

# Or with nginx (if installed)
nginx -c nginx.conf
```

---

## 🔐 Security Commands

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities (automatic)
npm audit fix

# Force fix (may introduce breaking changes)
npm audit fix --force

# Generate security report
npm audit --json > security-report.json

# Update packages to latest secure versions
npm update --depth 9999
```

---

## 📈 Performance Commands

### Analyze Bundle Size (Frontend)

```bash
cd frontend

# Build with analysis
npm run build

# Analyze bundle (if configured)
npm run analyze

# Or manually with source-map-explorer
npx source-map-explorer dist/assets/*.js
```

### Profile Node.js (Backend)

```bash
cd backend

# Start with profiling
node --prof src/index.js

# After running, process the profile
node --prof-process isolate-*.log > profile.txt
```

---

## 🧑‍💻 Development Workflow

### Typical Development Session

```bash
# 1. Pull latest changes
git pull

# 2. Install any new dependencies
npm run install:all

# 3. Start development servers
npm run dev

# 4. Make your changes...

# 5. Run tests
npm test

# 6. Commit changes
git add .
git commit -m "Your message"
git push
```

### Before Committing

```bash
# Run linter
cd frontend && npm run lint
cd backend && npm run lint

# Run tests
npm test

# Check for type errors (if using TypeScript)
cd frontend && npm run type-check
cd backend && npm run type-check

# Build to ensure no build errors
npm run build
```

---

## 🆘 Troubleshooting Commands

```bash
# Clear all caches and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
rm package-lock.json frontend/package-lock.json backend/package-lock.json
npm cache clean --force
npm run install:all

# Fix peer dependency issues
npm install --legacy-peer-deps

# Force specific Node version (with nvm)
nvm use 18

# Check Node and npm versions
node -v
npm -v

# Verify all required files exist
ls -la .env
ls -la frontend/.env
ls -la backend/uploads/

# Test backend health
curl http://localhost:5000/health

# Test frontend is running
curl http://localhost:5173
```

---

## 📚 Information Commands

```bash
# Show npm configuration
npm config list

# Show project information
npm info

# Show package.json scripts
npm run

# Show Node.js version
node -v

# Show npm version
npm -v

# Show installed global packages
npm list -g --depth=0

# Show workspace information
npm ls --workspace=frontend
npm ls --workspace=backend
```

---

## 🎯 Custom Scripts (Add to package.json)

Here are some useful custom scripts you might want to add:

```json
{
  "scripts": {
    "clean": "rm -rf node_modules frontend/node_modules backend/node_modules",
    "reset": "npm run clean && npm run install:all",
    "lint:all": "cd frontend && npm run lint && cd ../backend && npm run lint",
    "format": "prettier --write \"**/*.{js,jsx,json,md}\"",
    "check": "npm run lint:all && npm test",
    "deploy:frontend": "cd frontend && npm run build && netlify deploy",
    "deploy:backend": "cd backend && railway up",
    "logs:backend": "docker-compose logs -f backend",
    "logs:frontend": "docker-compose logs -f frontend"
  }
}
```

---

## 💡 Pro Tips

1. **Use npm scripts** instead of remembering long commands
2. **Run tests before committing** to catch issues early
3. **Use Docker for consistency** across development environments
4. **Keep dependencies updated** but test thoroughly
5. **Use npm workspaces** for monorepo management
6. **Check logs regularly** when debugging issues

---

## 🔗 Quick Links

- [npm documentation](https://docs.npmjs.com/)
- [Node.js documentation](https://nodejs.org/docs/)
- [Docker documentation](https://docs.docker.com/)
- [Vite documentation](https://vitejs.dev/)
- [Express documentation](https://expressjs.com/)

---

**Happy coding! 🚀**

For more information, see the main [README.md](./README.md)
