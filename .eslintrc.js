module.exports = {
  plugins: [
    'babel',
  ],
  env: {
    node: true,
  },
  parser: 'babel-eslint',
  extends: [
    'airbnb-base',
  ],
  rules: {
    'no-console': 0,
  },
  ignorePatterns: ['dist/'],
};
