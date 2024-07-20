// const { defaults: tsjPreset } = require('ts-jest/presets');
export default {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
    '\\.(css|less)$': '<rootDir>/fileTransformer.js',
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1',
    '@src/(.*)': '<rootDir>/src/$1',
    '@components/(.*)': '<rootDir>/src/components/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
  },
  modulePaths: ['<rootDir>'],
  transformIgnorePatterns: ['node_modules/.*'],
};
