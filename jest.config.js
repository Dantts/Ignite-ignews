module.exports = {
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy",
  },
  collectCoverage: true,
  collectCoverageForm: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.{js,jsx,ts,tsx}",
    "!src/**/_app.tsx",
    "!src/**/_document.tsx",
  ],
  coverageReporters: ["lcov", "json"],
};
