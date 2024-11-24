# Book Library Management System

A modern Angular application for managing a book library, built with Angular 18, NgRx for state management, Angular Material for UI components, and TailwindCSS for styling.

## Demo

Deploys to [https://books-test.pages.dev](https://books-test.pages.dev) on push to `origin/main` repo branch.

## Features

- Browse and search book collection
- View detailed book information
- Add, edit, and delete books
- Responsive material design interface
- State management with NgRx
- Animations and transitions

## Tech Stack

- Angular
- NgRx
- RxJS
- Angular Material
- TailwindCSS
- Luxon for date handling
- ESLint + Prettier for code quality
- NX for build and development tools

## Agenda

- Books CRUD
- Follows Angular style guide
- Uses TailwindCSS utilities for styling
- Implements strict TypeScript checks
- Wrote base unit tests

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- Yarn 1.22+

### Installation

```bash
git clone [repository-url]
cd [project-directory]
yarn install
```

### Development Server

```bash
yarn serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Building for Production

```bash
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   ├── models/
│   ├── services/
│   ├── store/
│   │   ├── actions/
│   │   ├── effects/
│   │   ├── reducers/
│   │   └── selectors/
│   └── routes/
├── assets/
└── styles/
```

## Available Scripts

- `yarn serve`: Start development server
- `yarn build`: Build production version
- `yarn test`: Run unit tests
- `yarn lint`: Run linting checks

## Contributing

1. Create a feature branch from `main`
2. Commit your changes following conventional commits
3. Push your branch and open a pull request

## License

MIT
