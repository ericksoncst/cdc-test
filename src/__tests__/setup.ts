import '@testing-library/jest-native/extend-expect';

global.__DEV__ = true;

jest.mock('react-native', () => {
  const React = require('react');
  return {
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((styles) => styles),
    },
    TouchableOpacity: React.forwardRef((props, ref) => {
      const { onPress, disabled, children, testID, ...rest } = props;
      const handlePress = () => {
        if (!disabled && onPress) {
          onPress();
        }
      };
      return React.createElement('TouchableOpacity', {
        ...rest,
        ref,
        disabled,
        onPress: handlePress,
        testID,
        children,
      });
    }),
    Text: 'Text',
    View: 'View',
    Alert: {
      alert: jest.fn(),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    Platform: {
      OS: 'ios',
      select: jest.fn((options) => options.ios),
    },
  };
});

jest.mock('react-native-vector-icons/Feather', () => 'Icon');

jest.mock('react-native-mask-input', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef((props: any, ref: any) => {
      const { onChangeText, value, mask, ...rest } = props;
      return React.createElement('TextInput', {
        ...rest,
        ref,
        value,
        onChangeText: (text: string) => {
          if (onChangeText) {
            onChangeText(text, text);
          }
        },
      });
    }),
    Masks: {
      BRL_CPF: jest.fn(),
      BRL_CNPJ: jest.fn(),
    },
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('axios', () => ({
  default: {
    create: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ data: {} })),
      post: jest.fn(() => Promise.resolve({ data: {} })),
      put: jest.fn(() => Promise.resolve({ data: {} })),
      delete: jest.fn(() => Promise.resolve({ data: {} })),
    })),
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  },
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  })),
}));

global.alert = jest.fn();