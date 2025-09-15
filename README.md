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
│  ├─ rest-client-app-logo.png
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ favicon.ico
│  │  ├─ global-not-found.test.tsx
│  │  ├─ global-not-found.tsx
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ store-provider.test.tsx
│  │  ├─ store-provider.tsx
│  │  └─ [locale]
│  │     ├─ auth
│  │     │  └─ [[...slug]]
│  │     │     ├─ AuthPage.test.tsx
│  │     │     └─ page.tsx
│  │     ├─ error.test.tsx
│  │     ├─ error.tsx
│  │     ├─ history
│  │     │  └─ page.tsx
│  │     ├─ layout.tsx
│  │     ├─ page.tsx
│  │     ├─ rest-client
│  │     │  └─ [[...params]]
│  │     │     └─ page.tsx
│  │     └─ variables
│  │        └─ page.tsx
│  ├─ components
│  │  ├─ layout
│  │  │  ├─ footer
│  │  │  │  ├─ developer-info.test.tsx
│  │  │  │  ├─ developer-info.tsx
│  │  │  │  ├─ index.test.tsx
│  │  │  │  ├─ index.tsx
│  │  │  │  └─ types
│  │  │  │     └─ developer-info.ts
│  │  │  └─ header
│  │  │     ├─ index.tsx
│  │  │     └─ indextest.tsx
│  │  ├─ ui
│  │  │  ├─ button.tsx
│  │  │  ├─ card.tsx
│  │  │  ├─ checkbox.tsx
│  │  │  ├─ dialog.tsx
│  │  │  ├─ form.tsx
│  │  │  ├─ input.tsx
│  │  │  ├─ label.tsx
│  │  │  ├─ select.tsx
│  │  │  ├─ separator.tsx
│  │  │  ├─ skeleton.tsx
│  │  │  ├─ sonner.tsx
│  │  │  └─ tabs.tsx
│  │  └─ widgets
│  │     ├─ language-switcher
│  │     │  ├─ index.tsx
│  │     │  ├─ LanguageSwitcher.test.tsx
│  │     │  ├─ useLanguageSwitcher.test.ts
│  │     │  └─ useLanguageSwitcher.ts
│  │     └─ LanguageSwitcher
│  │        └─ index.tsx
│  ├─ core
│  │  ├─ firebase
│  │  │  ├─ admin.ts
│  │  │  ├─ client.test.ts
│  │  │  └─ client.ts
│  │  ├─ http
│  │  │  ├─ url-encoding.test.ts
│  │  │  ├─ url-encoding.ts
│  │  │  └─ variable-replacer.ts
│  │  ├─ i18n
│  │  │  ├─ navigation.ts
│  │  │  ├─ request.ts
│  │  │  └─ routing.ts
│  │  ├─ index.ts
│  │  ├─ server
│  │  │  └─ index.ts
│  │  ├─ session
│  │  │  ├─ session.test.ts
│  │  │  └─ session.ts
│  │  ├─ storage
│  │  │  └─ local-storage.ts
│  │  ├─ store
│  │  │  ├─ hooks.ts
│  │  │  ├─ store.test.ts
│  │  │  └─ store.ts
│  │  └─ utils
│  │     └─ utils.ts
│  ├─ data
│  │  ├─ developerData.test.ts
│  │  └─ developerData.ts
│  ├─ features
│  │  ├─ auth
│  │  │  ├─ index.ts
│  │  │  ├─ model
│  │  │  │  ├─ definitions.test.ts
│  │  │  │  └─ definitions.ts
│  │  │  ├─ server
│  │  │  │  ├─ actions.test.ts
│  │  │  │  └─ actions.ts
│  │  │  └─ ui
│  │  │     ├─ sign-in-form.test.tsx
│  │  │     ├─ sign-in-form.tsx
│  │  │     ├─ sign-up-form.test.tsx
│  │  │     └─ sign-up-form.tsx
│  │  ├─ history
│  │  │  ├─ index.ts
│  │  │  ├─ server
│  │  │  │  └─ actions.ts
│  │  │  └─ ui
│  │  │     ├─ history-card.tsx
│  │  │     └─ history-list.tsx
│  │  ├─ index.ts
│  │  ├─ rest-client
│  │  │  ├─ index.ts
│  │  │  ├─ model
│  │  │  │  ├─ slice.test.ts
│  │  │  │  └─ slice.ts
│  │  │  ├─ server
│  │  │  │  ├─ actions.test.ts
│  │  │  │  └─ actions.ts
│  │  │  └─ ui
│  │  │     ├─ body-editor.test.tsx
│  │  │     ├─ body-editor.tsx
│  │  │     ├─ code-generator.test.tsx
│  │  │     ├─ code-generator.tsx
│  │  │     ├─ headers-editor.test.tsx
│  │  │     ├─ headers-editor.tsx
│  │  │     ├─ method-selector.test.tsx
│  │  │     ├─ method-selector.tsx
│  │  │     ├─ response-viewer.test.tsx
│  │  │     └─ response-viewer.tsx
│  │  └─ variables
│  │     ├─ index.ts
│  │     └─ model
│  │        └─ slice.ts
│  ├─ middleware.ts
│  └─ screens
│     ├─ auth
│     ├─ home
│     │  ├─ welcome-guest.tsx
│     │  └─ welcome-user.tsx
│     ├─ rest-client
│     │  ├─ page.client.test.tsx
│     │  └─ page.client.tsx
│     └─ variables
│        └─ page.client.tsx
├─ tsconfig.json
├─ vitest.config.ts
└─ vitest.setup.ts

```
