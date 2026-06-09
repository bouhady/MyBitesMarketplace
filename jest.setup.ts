import * as matchers from '@testing-library/react-native/matchers';

expect.extend(matchers);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-image', () => {
  const React = require('react');
  const { Image } = require('react-native');
  return { Image: (props: unknown) => React.createElement(Image, props) };
});
