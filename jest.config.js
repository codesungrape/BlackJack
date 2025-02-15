const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // Handle module aliases (if you're using them in your Next.js project)
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/lib/utils/(.*)$": "<rootDir>/src/lib/utils/$1",
  },
  collectCoverageFrom: [
    "src/components/**/*.{js, jsx, ts,tsx}",
    "src/lib/**/*.{js,jsx,ts,tsx}",
    "!src/components/**/*.test.{ts,tsx}",
    "!src/components/ui/**",
    "!src/components/**/theme-provider.tsx",
  ],
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  rootDir: ".",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
