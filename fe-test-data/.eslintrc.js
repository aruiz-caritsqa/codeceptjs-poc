module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:codeceptjs/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
  },
};
