import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const config = [
  {
    ignores: ['dist', '.next', 'coverage', 'node_modules', 'next-env.d.ts'],
  },
  ...compat.config({
    extends: ['next', 'next/core-web-vitals', 'next/typescript', 'prettier'],
  }),
];

export default config;
