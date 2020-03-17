module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  collectCoverage: false, // Needed to debug https://github.com/kulshekhar/ts-jest/issues/114
  collectCoverageFrom: ["src/**/*.ts"]
};
