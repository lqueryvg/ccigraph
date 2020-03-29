module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:import/typescript",
    "plugin:prettier/recommended"
  ],
  plugins: ["@typescript-eslint", "prettier"],
  env: {
    node: true,
    jest: true
  },
  settings: {
    "import/resolver": {
      node: {},
      webpack: {},
      ts: {
        alwaysTryTypes: true
      }
    }
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: false
      }
    ],
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-empty-function": 0,
    "no-useless-constructor": 0,
    "no-console": 0,
    "no-underscore-dangle": 0,
    "@typescript-eslint/no-useless-constructor": 0,
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never"
      }
    ]
  }
};
