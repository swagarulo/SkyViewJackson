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
      '^sanity$': '<rootDir>/__mocks__/sanity.ts',
      '^@/sanity/image$': '<rootDir>/__mocks__/sanity-image.js',
      '^@sanity/image-url(.*)$': '<rootDir>/__mocks__/sanity-image.js',
      '^next-sanity(.*)$': '<rootDir>/__mocks__/next-sanity.ts',
      '.*/src/sanity/image(\\.ts)?$': '<rootDir>/__mocks__/sanity-image.js',
      ...config.moduleNameMapper,
    },
  }
}
