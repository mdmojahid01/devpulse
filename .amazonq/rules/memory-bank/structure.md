# Project Structure

## Directory Organization

```
devpulse/
├── .amazonq/              # Amazon Q AI agent configuration
│   ├── agents/            # Agent definitions
│   └── rules/             # Project rules and guidelines
├── .husky/                # Git hooks for code quality
├── docs/                  # Documentation and assets
│   └── images/            # Screenshots and visual assets
├── public/                # Static assets for Chrome extension
│   ├── icons/             # Extension icons (16, 32, 48, 128px)
│   ├── manifest.json      # Chrome Extension Manifest v3
│   └── *.svg              # Favicon and logo assets
├── src/                   # Source code
│   ├── assets/            # Application assets
│   ├── components/        # React components
│   │   ├── github/        # GitHub-specific components
│   │   ├── ui/            # App-level custom UI components
│   │   ├── Footer.tsx     # Application footer
│   │   ├── SettingsModal.tsx  # Settings configuration UI
│   │   ├── ThemeToggle.tsx    # Theme switcher component
│   │   └── TodoList.tsx   # Todo management component
│   ├── config/            # Configuration files
│   │   ├── envConfig.ts   # Environment variables
│   │   └── site.ts        # Site-wide configuration
│   ├── context/           # React context definitions
│   │   └── theme-context.ts   # Theme state management
│   ├── hooks/             # Custom React hooks
│   │   ├── useAppConfig.ts    # App configuration hook
│   │   ├── useGithubData.ts   # GitHub data fetching
│   │   ├── useGlobalShortcuts.ts  # Keyboard shortcuts
│   │   ├── useTabTitle.ts     # Browser tab title management
│   │   ├── useTheme.ts        # Theme management hook
│   │   └── useTodos.ts        # Todo state management
│   ├── lib/               # Utility functions and helpers
│   │   ├── cache.ts       # Caching utilities
│   │   ├── chromeFetch.ts # Chrome extension fetch wrapper
│   │   ├── dateFormat.ts  # Date formatting utilities
│   │   ├── githubUtils.ts # GitHub-specific utilities
│   │   ├── notify.ts      # Notification system
│   │   └── utils.ts       # General utilities
│   ├── pages/             # Main page components
│   │   └── HomePage.tsx   # Primary dashboard page
│   ├── providers/         # React context providers
│   │   └── ThemeProvider.tsx  # Theme context provider
│   ├── services/          # API and storage services
│   │   ├── configStorage.ts   # Configuration persistence
│   │   ├── github.ts          # GitHub API integration
│   │   ├── storage.ts         # Generic storage utilities
│   │   ├── themeStorage.ts    # Theme persistence
│   │   └── todoStorage.ts     # Todo persistence
│   ├── App.tsx            # Root application component
│   └── main.tsx           # Application entry point
├── global.css             # Global styles
├── index.html             # HTML entry point (new tab override)
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

## Core Components and Relationships

### Entry Point Flow
1. **index.html** → Entry point for Chrome new tab override
2. **main.tsx** → Mounts React app with ThemeProvider and Toast.Provider
3. **App.tsx** → Root component orchestrating the application
4. **HomePage.tsx** → Main dashboard displaying all features

### Component Architecture

#### UI Layer (components/)
- **github/** - GitHub activity visualization components
- **ui/** - Reusable app-level custom components (buttons, cards, etc.)
- **TodoList.tsx** - Todo management with date-wise organization
- **SettingsModal.tsx** - Configuration interface
- **ThemeToggle.tsx** - Light/Dark mode switcher
- **Footer.tsx** - Application footer with links

#### State Management (hooks/)
- **useAppConfig.ts** - Global app configuration state
- **useGithubData.ts** - GitHub API data fetching and caching
- **useTodos.ts** - Todo CRUD operations and state
- **useTheme.ts** - Theme state and persistence
- **useGlobalShortcuts.ts** - Keyboard shortcut handling
- **useTabTitle.ts** - Dynamic browser tab title

#### Data Layer (services/)
- **github.ts** - GitHub API integration (contributions, activity)
- **todoStorage.ts** - Todo persistence using chrome.storage
- **configStorage.ts** - App configuration persistence
- **themeStorage.ts** - Theme preference persistence
- **storage.ts** - Generic storage abstraction

#### Utilities (lib/)
- **chromeFetch.ts** - Fetch wrapper for Chrome extension context
- **cache.ts** - Client-side caching mechanism
- **dateFormat.ts** - Date formatting and manipulation
- **githubUtils.ts** - GitHub-specific helper functions
- **notify.ts** - Toast notification system
- **utils.ts** - General utility functions (cn, etc.)

### Context and Providers

#### ThemeProvider (providers/ThemeProvider.tsx)
- Wraps entire application
- Provides theme state via theme-context.ts
- Manages light/dark mode switching
- Persists theme preference to chrome.storage

## Architectural Patterns

### Chrome Extension Architecture
- **Manifest v3** compliance
- **New Tab Override** - Replaces default new tab with index.html
- **Permissions** - Storage, GitHub API access
- **Host Permissions** - github.com, api.github.com

### React Patterns
- **Functional Components** with hooks
- **Context API** for global state (theme)
- **Custom Hooks** for business logic separation
- **Component Composition** using HeroUI v3 components

### Data Flow
1. User opens new tab → Chrome loads index.html
2. React mounts → ThemeProvider initializes theme
3. HomePage renders → Triggers data fetching hooks
4. Services fetch data → Cache and display results
5. User interactions → Update chrome.storage → Re-render

### Storage Strategy
- **chrome.storage.local** - Primary persistence layer
- **In-memory cache** - Performance optimization for API calls
- **Service layer abstraction** - Decouples storage from components

### Styling Approach
- **Tailwind CSS v4** - Utility-first styling
- **HeroUI v3** - Pre-built accessible components
- **Custom UI components** - App-specific reusable components
- **Theme variables** - CSS custom properties for theming
