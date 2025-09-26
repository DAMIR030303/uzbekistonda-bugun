const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|@supabase)/)',
  ],
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
  testMatch: [
    '<rootDir>/uzbekistonda-bugun-app/apps/mobile/src/__tests__/**/*.test.ts',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
