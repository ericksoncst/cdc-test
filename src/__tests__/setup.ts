import '@testing-library/jest-native/extend-expect';

global.__DEV__ = true;

let alertSpy: jest.SpyInstance;

jest.mock('react-native', () => {
  const React = require('react');
  
  const MockAlert = {
    alert: jest.fn(),
  };
  
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
    Text: React.forwardRef((props, ref) => {
      return React.createElement('Text', { ...props, ref });
    }),
    View: React.forwardRef((props, ref) => {
      return React.createElement('View', { ...props, ref });
    }),
    ScrollView: React.forwardRef((props, ref) => {
      const { children, refreshControl, onRefresh, ...rest } = props;
      if (refreshControl && onRefresh) {
        return React.createElement('ScrollView', {
          ...rest,
          ref,
          onRefresh,
          'data-testid': 'scroll-view'
        }, children);
      }
      return React.createElement('ScrollView', { ...rest, ref }, children);
    }),
    KeyboardAvoidingView: React.forwardRef((props, ref) => {
      return React.createElement('KeyboardAvoidingView', { ...props, ref });
    }),
    ActivityIndicator: React.forwardRef((props, ref) => {
      return React.createElement('ActivityIndicator', { ...props, ref });
    }),
    FlatList: React.forwardRef((props, ref) => {
      const { data, renderItem, keyExtractor, refreshControl, onRefresh, testID, ...rest } = props;
      
      if (!data || !renderItem) {
        return React.createElement('FlatList', { 
          ...rest, 
          ref, 
          testID,
          data,
          refreshControl: refreshControl || { props: { onRefresh } }
        });
      }
      
      const items = data.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item, index) : index.toString();
        return React.createElement('div', { key }, renderItem({ item, index }));
      });
      
      return React.createElement('FlatList', {
        ...rest,
        ref,
        testID,
        data,
        refreshControl: refreshControl || { props: { onRefresh } },
      }, items);
    }),
    RefreshControl: React.forwardRef((props, ref) => {
      return React.createElement('RefreshControl', { ...props, ref });
    }),
    Modal: React.forwardRef((props, ref) => {
      const { visible, children, ...rest } = props;
      return visible ? React.createElement('Modal', { ...rest, ref }, children) : null;
    }),
    TextInput: React.forwardRef((props, ref) => {
      return React.createElement('TextInput', { ...props, ref });
    }),
    Alert: MockAlert,
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    Platform: {
      OS: 'ios',
      select: jest.fn((options) => options.ios),
    },
  };
});

const { Alert } = require('react-native');
alertSpy = jest.spyOn(Alert, 'alert');



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

jest.mock('react-hook-form', () => {
  const React = require('react');
  return {
    Controller: ({ render }: any) => {
      const mockField = {
        onChange: jest.fn(),
        onBlur: jest.fn(),
        value: '',
      };
      const mockFieldState = {
        error: null,
      };
      return render({ field: mockField, fieldState: mockFieldState });
    },
    useForm: () => ({
      control: {},
      handleSubmit: jest.fn((fn) => fn),
      watch: jest.fn(() => ''),
      formState: { errors: {} },
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
    }),
  };
});

global.alert = jest.fn();

export const mockAlert = {
  alert: alertSpy,
};