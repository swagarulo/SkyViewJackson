import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const baseConfig: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

const jestConfig = createJestConfig(baseConfig)

export default async () => {
  const config = await jestConfig()
  return {
    ...config,
    moduleNameMapper: {
      ...config.moduleNameMapper,
      '^sanity$': '<rootDir>/__mocks__/sanity.ts',
    },
  }
}
