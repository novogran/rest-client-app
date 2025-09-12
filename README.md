# REST Client

## Technical Stack 💻

_In our project we use the following technologies:_

- **Frontend**:
  - [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
  - [Next.js](https://nextjs.org/)
  - [Shadcn](https://ui.shadcn.com/)
  - [Redux](https://redux.js.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Firebase](https://firebase.google.com/)

- **Code Quality**: [Husky](https://typicode.github.io/husky/), [Prettier](https://prettier.io/), [ESLint](https://eslint.org/)

- **Testing**: [Vitest](https://vitest.dev/)

## How to Run the Project

_To run the project locally, follow these steps:_

1. Clone the repository: `git clone https://github.com/novogran/rest-client-app.git`
2. Navigate to the project folder: `cd rest-client-app`
3. Install dependencies: `npm install`
4. Run the project: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts 📑

_You can run the following scripts in the project directory:_

- `npm run dev`: Starts the Next.js development server
- `npm run build`: Builds the application for production
- `npm run start`: Runs the built application in production mode
- `npm run lint`: Lints the codebase using ESLint
- `npm run format`: Formats code with Prettier
- `npm run prepare`: Sets up Husky git hooks
- `npm run test`: Runs tests with Vitest
- `npm run coverage`: Generates test coverage reports

```
rest-client-app
├─ .husky
│  ├─ commit-msg
│  ├─ pre-commit
│  ├─ pre-push
│  └─ _
│     ├─ applypatch-msg
│     ├─ commit-msg
│     ├─ h
│     ├─ husky.sh
│     ├─ post-applypatch
│     ├─ post-checkout
│     ├─ post-commit
│     ├─ post-merge
│     ├─ post-rewrite
│     ├─ pre-applypatch
│     ├─ pre-auto-gc
│     ├─ pre-commit
│     ├─ pre-merge-commit
│     ├─ pre-push
│     ├─ pre-rebase
│     └─ prepare-commit-msg
├─ .lintstagedrc.js
├─ .prettierrc
├─ commitlint.config.js
├─ components.json
├─ eslint.config.js
├─ messages
│  ├─ en.json
│  └─ ru.json
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ icons
│  │  ├─ github-logo.png
│  │  └─ rss-logo.svg
│  ├─ images
│  │  ├─ danil.jpg
│  │  ├─ denys.png
│  │  └─ vitaliy.jpg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  └─ [locale]
│  │     ├─ layout.tsx
│  │     ├─ not-found.test.tsx
│  │     ├─ not-found.tsx
│  │     ├─ page.tsx
│  │     └─ [...rest]
│  │        └─ page.tsx
│  ├─ components
│  │  ├─ DeveloperInfo
│  │  │  ├─ DeveloperInfo.test.tsx
│  │  │  └─ index.tsx
│  │  ├─ Footer
│  │  │  ├─ Footer.test.tsx
│  │  │  └─ index.tsx
│  │  ├─ NotFound
│  │  │  ├─ index.tsx
│  │  │  └─ NotFound.test.tsx
│  │  ├─ shared
│  │  │  └─ language-switcher
│  │  │     ├─ index.test.tsx
│  │  │     ├─ index.tsx
│  │  │     ├─ use-language-switcher.test.ts
│  │  │     └─ use-language-switcher.ts
│  │  └─ ui
│  │     ├─ button.tsx
│  │     ├─ dialog.tsx
│  │     └─ select.tsx
│  ├─ data
│  │  ├─ developerData.test.ts
│  │  └─ developerData.ts
│  ├─ i18n
│  │  ├─ navigation.ts
│  │  ├─ request.ts
│  │  └─ routing.ts
│  ├─ lib
│  │  └─ utils.ts
│  ├─ messages
│  │  ├─ en.json
│  │  └─ ru.json
│  ├─ middleware.ts
│  └─ types
│     └─ developerInfo.types.ts
├─ tsconfig.json
├─ vitest.config.ts
└─ vitest.setup.ts

```
