module.exports = {
  preset: 'jest-expo',
  roots: ['<rootDir>/src/test'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|expo|expo-.*|@expo/.*|@shopify/flash-list|@reduxjs/toolkit|immer|redux|react-redux|redux-persist|redux-saga|reselect)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
};
