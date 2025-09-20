const config = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{css,scss,md,json,html}': 'prettier --write',
};

export default config;
