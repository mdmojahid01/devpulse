# Technology Stack

## Programming Languages

### TypeScript 5.9.3
- Primary language for type-safe development
- Strict type checking enabled
- Used across all source files (.tsx, .ts)

### JavaScript (ES Modules)
- Module system: ES Modules (type: "module" in package.json)
- Target: Modern browsers (Chrome/Edge)

## Core Framework and Build System

### React 19.2.4
- Latest React version with modern features
- Functional components with hooks
- StrictMode enabled for development
- React DOM 19.2.4 for rendering

### Vite 8.0.1
- Ultra-fast build tool and dev server
- Hot Module Replacement (HMR)
- Optimized production builds
- Plugin: @vitejs/plugin-react 6.0.1

## UI Framework and Styling

### HeroUI v3.0.2
- Modern React component library
- Built on React Aria Components
- Accessible, customizable components
- Packages:
  - @heroui/react 3.0.2
  - @heroui/styles 3.0.2

### Tailwind CSS 4.2.2
- Utility-first CSS framework
- Vite plugin: @tailwindcss/vite 4.2.2
- Custom configuration for HeroUI integration
- Plugins:
  - tailwind-merge 3.5.0 (merge utility classes)
  - clsx 2.1.1 (conditional class names)

## Chrome Extension

### Manifest Version 3
- Modern Chrome extension API
- Permissions: storage
- Host permissions: github.com, api.github.com
- New tab override capability

### Chrome Types
- @types/chrome 0.1.40
- TypeScript definitions for Chrome APIs

## Routing

### React Router DOM 7.14.0
- Client-side routing (if needed for future expansion)
- Currently single-page application

## Icons

### React Icons 5.6.0
- Comprehensive icon library
- Multiple icon sets (FontAwesome, Material, etc.)

## Development Tools

### TypeScript Configuration
- tsconfig.json - Base configuration
- tsconfig.app.json - Application-specific config
- tsconfig.node.json - Node.js tooling config

### ESLint 9.39.4
- Code linting and quality enforcement
- Plugins:
  - @eslint/js 9.39.4
  - eslint-plugin-react-hooks 7.0.1
  - eslint-plugin-react-refresh 0.5.2
  - typescript-eslint 8.57.0
- Configuration: eslint.config.js

### Prettier 3.8.1
- Code formatting
- Plugin: prettier-plugin-tailwindcss 0.7.2
- Configuration: .prettierrc, .prettierignore

### Husky 9.1.7
- Git hooks management
- Pre-commit hooks for code quality

### Lint-Staged 16.4.0
- Run linters on staged files
- Configuration: lint-staged.config.js

## Type Definitions

- @types/node 24.12.0
- @types/react 19.2.14
- @types/react-dom 19.2.3
- @types/chrome 0.1.40

## Additional Tools

### Globals 17.4.0
- Global variable definitions for ESLint

### CSpell
- Spell checking configuration (cspell.json)

## Build Commands

```bash
# Development
npm run dev          # Start Vite dev server with HMR

# Production
npm run build        # TypeScript check + Vite build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Git Hooks
npm run prepare      # Setup Husky hooks
```

## Environment Configuration

### Environment Variables
- Managed via envConfig.ts (not .env files)
- Chrome extension compatible configuration
- Type-safe environment access

## Browser Compatibility

### Target Browsers
- Chrome 88+ (Manifest v3 support)
- Edge 88+ (Chromium-based)

### Required Features
- ES Modules support
- Chrome Extension APIs
- Modern JavaScript (ES2020+)

## API Integrations

### GitHub API
- REST API v3
- Endpoints: api.github.com
- Authentication: Personal access tokens (optional)
- Rate limiting: Handled with caching

### LeetCode API
- Integration for coding stats (implementation in services/)

## Storage

### Chrome Storage API
- chrome.storage.local for persistence
- Async storage operations
- Storage quota: 5MB (local storage limit)

## Performance Optimizations

### Caching Strategy
- In-memory cache (lib/cache.ts)
- Chrome storage for persistence
- API response caching to reduce requests

### Code Splitting
- Vite automatic code splitting
- Dynamic imports where applicable

## Development Workflow

1. **Local Development**: `npm run dev` → Vite dev server
2. **Code Quality**: Husky pre-commit hooks → lint-staged → ESLint + Prettier
3. **Build**: `npm run build` → TypeScript check → Vite production build
4. **Extension Loading**: Load `dist/` folder as unpacked extension

## Deployment

### Web Demo
- Platform: Netlify
- Configuration: netlify.toml
- URL: https://devpulse.mojahid.dev/

### Chrome Extension
- Build output: dist/ folder
- Load as unpacked extension in chrome://extensions/
- Future: Chrome Web Store distribution
