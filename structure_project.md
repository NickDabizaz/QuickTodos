# Project Structure

```
project/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/        # Shared components (buttons, inputs, etc.)
│   │   └── features/      # Feature-specific components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and external service integrations
│   ├── utils/             # Utility functions and helpers
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # App-wide constants
│   ├── styles/            # Global styles and theme
│   └── assets/            # Static assets (images, fonts, etc.)
├── public/                # Public static files
├── tests/                 # Test files
│   ├── components/        # Component tests
│   ├── pages/            # Page tests
│   └── utils/            # Utility tests
├── docs/                  # Documentation
├── scripts/              # Build and deployment scripts
├── .github/              # GitHub specific files
├── .husky/               # Git hooks
├── .vscode/              # VS Code settings
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
└── CHANGELOG.md          # Version history
```

## Key Directories

- `src/`: Main source code directory
  - `components/`: Reusable UI components
  - `pages/`: Page-level components
  - `hooks/`: Custom React hooks
  - `services/`: API and external service integrations
  - `utils/`: Helper functions and utilities
  - `types/`: TypeScript type definitions
  - `constants/`: App-wide constants
  - `styles/`: Global styles and theme
  - `assets/`: Static assets

- `public/`: Static files served as-is
- `tests/`: Test files mirroring src structure
- `docs/`: Project documentation
- `scripts/`: Build and deployment scripts

## Configuration Files

- `package.json`: Project metadata and dependencies
- `tsconfig.json`: TypeScript configuration
- `.eslintrc.js`: ESLint rules
- `.prettierrc`: Code formatting rules
- `.gitignore`: Git ignore rules
- `.github/`: GitHub specific configurations
- `.husky/`: Git hooks
- `.vscode/`: VS Code settings 