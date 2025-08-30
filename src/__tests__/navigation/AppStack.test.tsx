import React from 'react';
import { render } from '@testing-library/react-native';
import AppStack from '../../navigation/AppStack';

import '../setup';

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  return {
    createNativeStackNavigator: () => ({
      Navigator: React.forwardRef((props: any, ref: any) => {
        const { children, initialRouteName, screenOptions } = props;
        return React.createElement('Navigator', { 
          ref,
          testID: 'app-navigator',
          initialRouteName,
          screenOptions: JSON.stringify(screenOptions),
          children,
        });
      }),
      Screen: React.forwardRef((props: any, ref: any) => {
        const { component: Component, name } = props;
        return React.createElement('Screen', { 
          ref,
          testID: `app-screen-${name.toLowerCase()}`,
          name,
        }, Component ? React.createElement(Component) : null);
      }),
    }),
  };
});

jest.mock('../../screens/App/ClientsPanelScreen', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    return React.createElement('ClientsPanelScreen', { 
      ...props, 
      ref,
      testID: 'clients-panel-screen' 
    });
  });
});

jest.mock('../../screens/App/EditClientScreen', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    return React.createElement('EditClientScreen', { 
      ...props, 
      ref,
      testID: 'edit-client-screen' 
    });
  });
});

jest.mock('../../screens/App/CreateClientScreen', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    return React.createElement('CreateClientScreen', { 
      ...props, 
      ref,
      testID: 'create-client-screen' 
    });
  });
});

jest.mock('../../screens/App/TransferScreen', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    return React.createElement('TransferScreen', { 
      ...props, 
      ref,
      testID: 'transfer-screen' 
    });
  });
});

describe('AppStack', () => {
  it('renders Navigator with correct props', () => {
    const { getByTestId } = render(<AppStack />);
    
    const navigator = getByTestId('app-navigator');
    expect(navigator).toBeTruthy();
    expect(navigator.props.initialRouteName).toBe('ClientsPanel');
    
    const screenOptions = JSON.parse(navigator.props.screenOptions);
    expect(screenOptions.headerShown).toBe(false);
    expect(screenOptions.gestureEnabled).toBe(true);
    expect(screenOptions.animation).toBe('slide_from_right');
  });

  it('renders all required screens', () => {
    const { getByTestId } = render(<AppStack />);
    
    expect(getByTestId('app-screen-clientspanel')).toBeTruthy();
    expect(getByTestId('app-screen-editclient')).toBeTruthy();
    expect(getByTestId('app-screen-createclient')).toBeTruthy();
    expect(getByTestId('app-screen-transfer')).toBeTruthy();
  });

  it('renders screen components', () => {
    const { getByTestId } = render(<AppStack />);
    
    expect(getByTestId('clients-panel-screen')).toBeTruthy();
    expect(getByTestId('edit-client-screen')).toBeTruthy();
    expect(getByTestId('create-client-screen')).toBeTruthy();
    expect(getByTestId('transfer-screen')).toBeTruthy();
  });

  it('has correct screen names', () => {
    const { getByTestId } = render(<AppStack />);
    
    expect(getByTestId('app-screen-clientspanel').props.name).toBe('ClientsPanel');
    expect(getByTestId('app-screen-editclient').props.name).toBe('EditClient');
    expect(getByTestId('app-screen-createclient').props.name).toBe('CreateClient');
    expect(getByTestId('app-screen-transfer').props.name).toBe('Transfer');
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(<AppStack />);
    expect(getByTestId('app-navigator')).toBeTruthy();
  });

  it('uses ClientsPanel as initial route', () => {
    const { getByTestId } = render(<AppStack />);
    
    const navigator = getByTestId('app-navigator');
    expect(navigator.props.initialRouteName).toBe('ClientsPanel');
  });

  it('configures navigation options correctly', () => {
    const { getByTestId } = render(<AppStack />);
    
    const navigator = getByTestId('app-navigator');
    const screenOptions = JSON.parse(navigator.props.screenOptions);
    
    expect(screenOptions.headerShown).toBe(false);
    expect(screenOptions.gestureEnabled).toBe(true);
    expect(screenOptions.animation).toBe('slide_from_right');
  });
});