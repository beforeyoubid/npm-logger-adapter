export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testMatch: ['(/__tests__/.*|(\\.|/)(test|spec))\\.ts$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
