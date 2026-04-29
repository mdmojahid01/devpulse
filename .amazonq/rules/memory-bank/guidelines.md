# Development Guidelines

## Code Quality Standards

### File Structure and Organization
- **Imports Order**: React imports first, then third-party libraries (HeroUI, react-icons), then local imports (@/ aliases)
- **Import Grouping**: Group by category with blank lines between groups
- **Path Aliases**: Use `@/` prefix for all internal imports (components, hooks, services, lib)
- **Type Imports**: Use `type` keyword for type-only imports: `import type { Todo } from "@/services/todoStorage"`

### Naming Conventions
- **Components**: PascalCase for component files and functions (TodoList.tsx, AppCard.tsx)
- **Hooks**: camelCase with "use" prefix (useTodos, useGlobalShortcuts, useGithubData)
- **Services**: camelCase for service objects (todoStorage, configStorage, themeStorage)
- **Types**: PascalCase for type definitions (Todo, GithubRepo, GithubEvent)
- **Constants**: SCREAMING_SNAKE_CASE for storage keys (STORAGE_KEY, GITHUB_BASE_URL)
- **Functions**: camelCase for all functions (handleAdd, loadTodos, scrapeContributions)
- **Variables**: camelCase for all variables (newTitle, showInput, expandedSubtasks)

### TypeScript Patterns
- **Explicit Return Types**: Define return types for hooks and complex functions
  ```typescript
  export function useTodos(): UseTodosReturn { ... }
  async getTodos(): Promise<Todo[]> { ... }
  ```
- **Type Aliases**: Use `type` for object shapes and unions
- **Optional Properties**: Use `?` for optional fields in types and function parameters
- **Type Assertions**: Use `satisfies` for type validation: `{ date, count, level } satisfies Contribution`
- **Generic Types**: Use generics for reusable storage functions: `cache.get<Todo[]>(cacheKey)`
- **Readonly Props**: Mark component props as `Readonly<Props>` for immutability

### Code Formatting
- **Indentation**: 2 spaces (enforced by Prettier)
- **Quotes**: Double quotes for strings
- **Semicolons**: Always use semicolons
- **Line Length**: Prettier handles wrapping (typically 80-100 chars)
- **Trailing Commas**: Always use trailing commas in multi-line arrays/objects
- **Arrow Functions**: Prefer arrow functions for callbacks and inline functions

## React Patterns

### Component Structure
1. **Imports** - React, third-party, local
2. **Type Definitions** - Props interfaces, local types
3. **Component Function** - Main component logic
4. **State Declarations** - useState hooks
5. **Memoized Values** - useMemo for computed values
6. **Effects** - useEffect for side effects
7. **Callbacks** - useCallback for event handlers
8. **Render Logic** - JSX return statement
9. **Sub-components** - Helper components at bottom of file

### Hook Usage Patterns
- **Custom Hooks**: Extract reusable logic into custom hooks (useTodos, useGithubData)
- **Hook Dependencies**: Always include all dependencies in useEffect/useCallback/useMemo arrays
- **Hook Return Types**: Define explicit return type interfaces for custom hooks
- **State Initialization**: Use functional initialization for expensive computations
- **Callback Memoization**: Use useCallback for functions passed to child components or used in effects

### State Management
- **Local State**: Use useState for component-specific state
- **Derived State**: Use useMemo for computed values from state
- **Async State**: Track loading, error, and data states separately
  ```typescript
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  ```
- **Context**: Use React Context for global state (theme)
- **Storage Sync**: Sync state with chrome.storage via custom hooks

### Event Handlers
- **Naming**: Prefix with "handle" (handleAdd, handleCancel, handleKeyDown)
- **Async Handlers**: Use async/await for asynchronous operations
- **Error Handling**: Wrap async operations in try-catch blocks
- **Callback Wrapping**: Use useCallback to prevent unnecessary re-renders
- **Event Prevention**: Call e.preventDefault() when needed to prevent default behavior

### Conditional Rendering
- **Ternary Operators**: Use for simple conditions: `{loading ? <Spinner /> : <Content />}`
- **Logical AND**: Use && for conditional rendering: `{todos.length > 0 && <TodoList />}`
- **Early Returns**: Return loading/error states early in component
- **Empty States**: Always provide empty state messages for better UX

## HeroUI v3 Component Patterns

### Component Composition
- **Compound Components**: Use dot notation for sub-components
  ```typescript
  <AppCard>
    <AppCard.Header>...</AppCard.Header>
    <AppCard.Content>...</AppCard.Content>
  </AppCard>
  ```
- **Tooltip Pattern**: Wrap interactive elements with Tooltip
  ```typescript
  <Tooltip>
    <Tooltip.Trigger><Button /></Tooltip.Trigger>
    <Tooltip.Content><p>Tooltip text</p></Tooltip.Content>
  </Tooltip>
  ```
- **Dropdown Pattern**: Use for menus and actions
  ```typescript
  <Dropdown>
    <Button />
    <Dropdown.Popover>
      <Dropdown.Menu onAction={handler}>
        <Dropdown.Item id="action">Label</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown.Popover>
  </Dropdown>
  ```

### Custom UI Components (components/ui/)
- **App-Level Wrappers**: Create custom wrappers for HeroUI components (AppCard, AppButton, AppInput)
- **Consistent API**: Maintain consistent prop interfaces across custom components
- **Variant Support**: Provide variant props for different styles (primary, secondary, danger, ghost)
- **Size Support**: Provide size props (sm, md, lg)
- **Icon Support**: Support prefix/suffix icons for buttons and inputs

### Styling Approach
- **Tailwind Utilities**: Use Tailwind CSS utility classes for styling
- **Conditional Classes**: Use template literals for dynamic classes
  ```typescript
  className={`text-sm ${todo.completed ? "text-muted line-through" : "text-foreground"}`}
  ```
- **Class Merging**: Use cn() utility (clsx + tailwind-merge) for conditional classes
- **Semantic Colors**: Use semantic color tokens (text-foreground, text-muted, text-accent, text-danger)
- **Spacing**: Use Tailwind spacing scale (gap-2, p-4, space-y-4)

## Service Layer Patterns

### Storage Services
- **Service Objects**: Export objects with methods (todoStorage, configStorage)
- **Async Methods**: All storage methods are async and return Promises
- **CRUD Operations**: Implement get, set, add, update, delete methods
- **Storage Keys**: Use prefixed constants for storage keys (devpulse_todos)
- **Error Handling**: Throw descriptive errors for validation failures

### API Services
- **Caching**: Cache API responses with TTL (time-to-live)
  ```typescript
  const cacheKey = `contributions_${username}_${query.y}`;
  const cached = await cache.get<Response>(cacheKey);
  if (cached) return cached;
  // ... fetch data
  await cache.set(cacheKey, result, 3600000); // 1 hour
  ```
- **Chrome Fetch**: Use chromeFetch wrapper for Chrome extension compatibility
- **Request Options**: Define request options separately for reusability
- **Response Validation**: Validate API responses before returning
- **Type Safety**: Define TypeScript types for all API responses

### Data Transformation
- **Parsing Functions**: Create separate functions for parsing complex data (parseDay)
- **Data Normalization**: Transform API responses into consistent formats
- **Date Handling**: Use ISO 8601 format (YYYY-MM-DD) for dates
- **ID Generation**: Use crypto.randomUUID() for unique IDs

## Utility Functions

### Common Utilities (lib/utils.ts)
- **Class Name Merging**: cn() function using clsx + tailwind-merge
- **Date Formatting**: formatDate() for human-readable dates
- **Notification System**: notifySuccess(), notifyError() for user feedback

### Chrome Extension Utilities
- **chromeFetch**: Wrapper around fetch for Chrome extension context
- **cache**: In-memory caching with TTL support
- **storage**: Abstraction over chrome.storage.local API

### Helper Functions
- **Pure Functions**: Keep utility functions pure (no side effects)
- **Single Responsibility**: Each function should do one thing well
- **Type Safety**: Provide explicit parameter and return types
- **Error Handling**: Handle edge cases and throw descriptive errors

## Chrome Extension Specific Patterns

### Storage API Usage
- **Async Operations**: All chrome.storage operations are async
- **Storage Abstraction**: Use service layer to abstract chrome.storage
- **Data Serialization**: Store JSON-serializable data only
- **Storage Limits**: Be mindful of 5MB local storage limit

### Manifest v3 Compliance
- **Permissions**: Request only necessary permissions (storage, host_permissions)
- **Host Permissions**: Specify exact domains (github.com, api.github.com)
- **New Tab Override**: Use chrome_url_overrides.newtab for new tab replacement
- **Content Security Policy**: Follow CSP restrictions (no inline scripts)

### Cross-Origin Requests
- **Host Permissions**: Declare host_permissions in manifest.json
- **CORS Handling**: Use chromeFetch for cross-origin requests
- **Request Headers**: Set appropriate headers (Accept, Referer, X-Requested-With)

## Performance Optimization

### Memoization
- **useMemo**: Memoize expensive computations
  ```typescript
  const analytics = useMemo(() => {
    const totalPending = todos.filter(t => !t.completed).length;
    return { totalPending, todayPending, totalCompleted };
  }, [todos, todayTodos, countWithSubtasks]);
  ```
- **useCallback**: Memoize callback functions to prevent re-renders
- **Dependency Arrays**: Keep dependency arrays minimal and accurate

### Caching Strategy
- **API Response Caching**: Cache API responses with appropriate TTL
  - Contributions: 1 hour (3600000ms)
  - Repos: 30 minutes (1800000ms)
  - Events: 5 minutes (300000ms)
- **In-Memory Cache**: Use cache.ts for runtime caching
- **Storage Cache**: Use chrome.storage for persistent caching

### Rendering Optimization
- **Conditional Rendering**: Avoid rendering hidden content
- **List Keys**: Use stable unique keys for list items (todo.id)
- **Component Splitting**: Split large components into smaller sub-components
- **Lazy Loading**: Consider lazy loading for heavy components

## Error Handling

### Try-Catch Patterns
- **Async Operations**: Wrap all async operations in try-catch
- **Error Messages**: Provide user-friendly error messages
- **Error Propagation**: Re-throw errors when needed for upstream handling
- **Type Guards**: Use `instanceof Error` for error type checking
  ```typescript
  catch (err) {
    setError(err instanceof Error ? err.message : "Failed to load todos");
  }
  ```

### User Feedback
- **Toast Notifications**: Use notifySuccess() and notifyError() for feedback
- **Loading States**: Show loading indicators during async operations
- **Error States**: Display error messages in UI
- **Confirmation Dialogs**: Use confirm() for destructive actions

### Validation
- **Input Validation**: Validate user input before processing
- **Data Validation**: Validate imported/external data structure
- **Type Validation**: Use TypeScript for compile-time validation
- **Runtime Checks**: Add runtime checks for critical operations

## Testing and Quality Assurance

### Code Quality Tools
- **ESLint**: Enforce code quality rules
- **Prettier**: Automatic code formatting
- **TypeScript**: Static type checking
- **Husky**: Pre-commit hooks for quality checks
- **Lint-Staged**: Run linters on staged files only

### Best Practices
- **Type Safety**: Leverage TypeScript for type safety
- **Immutability**: Avoid mutating state directly
- **Pure Functions**: Prefer pure functions for utilities
- **Single Responsibility**: Each function/component should have one purpose
- **DRY Principle**: Don't repeat yourself - extract reusable logic

## Documentation

### Code Comments
- **Minimal Comments**: Write self-documenting code
- **JSDoc Comments**: Use JSDoc for complex functions and hooks
- **Type Documentation**: Use TypeScript types as documentation
- **Inline Comments**: Add comments only for complex logic

### Component Documentation
- **Props Interface**: Define clear props interfaces
- **Return Type**: Document hook return types
- **Usage Examples**: Provide examples in comments when needed

## Keyboard Shortcuts

### Shortcut Implementation
- **Global Shortcuts**: Use useGlobalShortcuts hook
- **Shortcut Definition**: Define shortcuts with key, modifier, handler, description
  ```typescript
  const shortcuts = useMemo(() => [{
    key: "k",
    ctrlOrCmd: true,
    handler: () => setShowInput(prev => !prev),
    description: "Toggle add task",
  }], []);
  ```
- **Cross-Platform**: Support both Cmd (Mac) and Ctrl (Windows/Linux)
- **Visual Indicators**: Show keyboard shortcuts in UI using AppKbd component

### Common Shortcuts
- **Cmd/Ctrl + K**: Toggle add task input
- **Enter**: Submit form
- **Cmd/Ctrl + Enter**: Submit with modifier
- **Escape**: Cancel/close

## Accessibility

### Semantic HTML
- **Proper Elements**: Use semantic HTML elements (button, input, label)
- **ARIA Labels**: Provide ariaLabel for inputs and buttons
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Focus Management**: Manage focus for modals and dynamic content

### HeroUI Accessibility
- **Built-in A11y**: HeroUI components have built-in accessibility
- **Keyboard Support**: All HeroUI components support keyboard navigation
- **Screen Reader Support**: Components include proper ARIA attributes
- **Focus Indicators**: Visual focus indicators for keyboard navigation

## Git Workflow

### Commit Standards
- **Pre-commit Hooks**: Husky runs linters before commit
- **Lint-Staged**: Only lint changed files
- **Commit Messages**: Write clear, descriptive commit messages
- **Atomic Commits**: Make small, focused commits

### Code Review
- **Type Safety**: Ensure all code is type-safe
- **Code Style**: Follow Prettier formatting
- **Linting**: Pass all ESLint checks
- **Testing**: Test changes manually before committing
