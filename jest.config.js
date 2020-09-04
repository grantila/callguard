module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  coveragePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  coverageReporters: ['lcov', 'text', 'html'],
};
