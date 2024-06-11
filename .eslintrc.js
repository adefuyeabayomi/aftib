let config = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:node/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "warn",
  },
  plugins: ["prettier"],
};
module.exports = config;
