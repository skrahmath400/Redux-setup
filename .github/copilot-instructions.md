# Copilot Instructions - React Admin Dashboard

## Project Overview
A Create React App (CRA) project for an education management system with JWT-based authentication and role-based access control. The app manages user credentials and screen permissions for a school administration platform (North Wing Campus).

## Architecture & Key Patterns

### Component Structure
- **File naming**: `.jsx` extension for component files (e.g., `First.jsx`, `Somecomponents.jsx`)
- **Root component**: [src/App.js](src/App.js) - simple composition of two main components
- **Components location**: [src/components/](src/components/) directory
- **State management**: Local component state using `useState` hook (no Redux/Context API currently)

### Conventions
1. **Component Imports**: Always import React and hooks at the top. Example:
   ```jsx
   import React, { useState } from "react";
   import { jwtDecode } from "jwt-decode";
   ```

2. **Form Handling**: Use controlled components with `useState` for form data. Use spread operator to update state:
   ```jsx
   const handlechange = (e) => {
     setdata({ ...data, [e.target.name]: e.target.value })
   }
   ```

3. **Naming Inconsistencies**: Note typos exist in the codebase (e.g., `setdata` instead of `setData`, `wigeds` folder instead of `widgets`). Maintain consistency within new code but don't refactor existing patterns without explicit request.

## Key Dependencies
- **react** (19.2.3) & **react-dom** (19.2.3) - UI framework
- **jwt-decode** (4.0.0) - For decoding JWT tokens containing user roles and screen permissions
- **@testing-library/react** (16.3.1) - Component testing

## Authentication & Authorization Pattern
The [First.jsx](src/components/First.jsx) component demonstrates JWT token handling:
- Hard-coded JWT token for testing (contains admin credentials)
- Token includes: `username`, `role`, `category`, `campusName`, and `screenPermissions` array
- Screen permissions structure: `{ screenId, url, access }` - maps screens to role-based access levels
- **Note**: Hard-coded tokens should be replaced with API-based authentication in production

## Developer Workflows

### Build & Run
```bash
npm start       # Dev server on localhost:3000 (hot reload)
npm test        # Jest test runner (interactive watch mode)
npm run build   # Production build to /build folder
npm run eject   # One-way operation - exposes CRA config (avoid)
```

### Testing
- Test files follow pattern: `*.test.js` (e.g., `App.test.js`)
- ESLint config extends `react-app` and `react-app/jest` for both React and Jest rules
- Use `@testing-library/react` for component testing (see [setupTests.js](src/setupTests.js))

## Directory Structure Notes
- **asserts/** - Likely intended for "assets" (images, static files) - check naming
- **wigeds/** - Likely intended for "widgets" folder (reusable UI components)
- **public/** - Static files including manifest.json for PWA support

## Important Caveats
1. **No backend integration yet** - All data is client-side state
2. **Hard-coded credentials** in First.jsx component - to be replaced
3. **Folder naming typos** suggest early-stage project - follow existing patterns for consistency
4. **No global state management** - all state is local; consider Context API or Redux if complexity increases

## Next Agent Priorities
- Understand JWT token structure and role-based access requirements before adding new screens
- Add backend API integration to replace hard-coded tokens
- Create reusable form components (form validation patterns shown in Somecomponents.jsx)
- Consider extracting form state management to custom hook
