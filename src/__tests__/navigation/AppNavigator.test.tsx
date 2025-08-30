import React from 'react';
import { render } from '@testing-library/react-native';
import AppNavigator from '../../navigation';
import { useAuth } from '../../contexts/AuthContext';

import '../setup';

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    NavigationContainer: ({ children }: any) => React.createElement('NavigationContainer', {}, children),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    }),
    useFocusEffect: jest.fn(),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }: any) => React.createElement('Navigator', {}, children),
      Screen: ({ component: Component, name }: any) => React.createElement('Screen', { name }, Component && React.createElement(Component)),
    }),
  };
});

jest.mock('../../contexts/AuthContext');

jest.mock('../../navigation/AuthStack', () => {
  const React = require('react');
  return function AuthStack() {
    return React.createElement('AuthStack', { testID: 'auth-stack' });
  };
});

jest.mock('../../navigation/AppStack', () => {
  const React = require('react');
  return function AppStack() {
    return React.createElement('AppStack', { testID: 'app-stack' });
  };
});

describe('AppNavigator', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading indicator when isLoading is true', () => {
    mockUseAuth.mockReturnValue({
      partner: null,
      isLoading: true,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { getByTestId } = render(<AppNavigator />);
    
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('renders AuthStack when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      partner: null,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { getByTestId } = render(<AppNavigator />);
    
    expect(getByTestId('auth-stack')).toBeTruthy();
  });

  it('renders AppStack when user is authenticated', () => {
    const mockPartner = {
      id: 1,
      name: 'João Silva',
      email: 'joao@bank.com',
      password: '123456',
    };

    mockUseAuth.mockReturnValue({
      partner: mockPartner,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { getByTestId } = render(<AppNavigator />);
    
    expect(getByTestId('app-stack')).toBeTruthy();
  });

  it('renders NavigationContainer when not loading', () => {
    mockUseAuth.mockReturnValue({
      partner: null,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { getByTestId } = render(<AppNavigator />);
    
    expect(getByTestId('auth-stack')).toBeTruthy();
  });

  it('does not render stacks when loading', () => {
    mockUseAuth.mockReturnValue({
      partner: null,
      isLoading: true,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { queryByTestId } = render(<AppNavigator />);
    
    expect(queryByTestId('auth-stack')).toBeNull();
    expect(queryByTestId('app-stack')).toBeNull();
  });
});