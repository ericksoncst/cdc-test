import React from 'react';
import { render } from '@testing-library/react-native';
import AuthStack from '../../navigation/AuthStack';

import '../setup';

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  return {
    createNativeStackNavigator: () => ({
      Navigator: React.forwardRef((props: any, ref: any) => {
        const { children, initialRouteName, screenOptions } = props;
        return React.createElement('Navigator', { 
          ref,
          testID: 'auth-navigator',
          initialRouteName,
          screenOptions: JSON.stringify(screenOptions),
        }, children);
      }),
      Screen: React.forwardRef((props: any, ref: any) => {
        const { component: Component, name } = props;
        return React.createElement('Screen', { 
          ref,
          testID: `auth-screen-${name.toLowerCase()}`,
          name,
        }, Component ? React.createElement(Component) : null);
      }),
    }),
  };
});

jest.mock('../../screens/Login/LoginScreen', () => {
  const React = require('react');
  return {
    LoginScreen: () => React.createElement('LoginScreen', { testID: 'login-screen' }),
  };
});

describe('AuthStack', () => {
  it('renders Navigator with correct props', () => {
    const { getByTestId } = render(<AuthStack />);
    
    const navigator = getByTestId('auth-navigator');
    expect(navigator).toBeTruthy();
    expect(navigator.props.initialRouteName).toBe('Login');
    
    const screenOptions = JSON.parse(navigator.props.screenOptions);
    expect(screenOptions.headerShown).toBe(false);
  });

  it('renders Login screen', () => {
    const { getByTestId } = render(<AuthStack />);
    
    expect(getByTestId('auth-screen-login')).toBeTruthy();
    expect(getByTestId('login-screen')).toBeTruthy();
  });

  it('has correct screen configuration', () => {
    const { getByTestId } = render(<AuthStack />);
    
    const loginScreen = getByTestId('auth-screen-login');
    expect(loginScreen.props.name).toBe('Login');
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(<AuthStack />);
    expect(getByTestId('auth-navigator')).toBeTruthy();
  });
});