module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.(ts|tsx)'],
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx', '!src/renderer/**']
};
