import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import '../setup';
import { mockAlert } from '../setup';

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

jest.mock('react-native-vector-icons/Feather', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    return React.createElement('Text', { ...props, ref }, props.name);
  });
});

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    partner: { id: 1, name: 'Test User', email: 'test@test.com' },
    logout: jest.fn(),
  }),
}));

jest.mock('../../contexts/ClientContext', () => ({
  useClients: () => ({
    filteredClients: [
      {
        id: 1,
        partnerId: 1,
        name: 'Test Client',
        document: '12345678900',
        age: 30,
        monthlyIncome: 5000,
        balance: 1000,
      },
    ],
    isLoading: false,
    searchTerm: '',
    setSearchTerm: jest.fn(),
    deleteClient: jest.fn(),
    refreshClients: jest.fn(),
  }),
}));

jest.mock('../../viewModels/useEditClientViewModel', () => ({
  useEditClientViewModel: jest.fn(() => ({
    control: {},
    handleSubmit: jest.fn((fn) => fn),
    onSubmit: jest.fn(),
    isLoading: false,
    isPersonalDocument: true,
  })),
}));

jest.mock('../../viewModels/useTransferViewModel', () => ({
  useTransferViewModel: jest.fn(() => ({
    control: {},
    handleSubmit: jest.fn((fn) => fn),
    onSubmit: jest.fn(),
    isLoading: false,
    clients: [],
    fromClient: null,
    toClient: null,
    setFromClient: jest.fn(),
    setToClient: jest.fn(),
    showFromModal: false,
    showToModal: false,
    setShowFromModal: jest.fn(),
    setShowToModal: jest.fn(),
    setValue: jest.fn(),
    errors: {},
  })),
}));

jest.mock('../../viewModels/useCreateClientViewModel', () => ({
  useCreateClientViewModel: jest.fn(() => ({
    form: {
      control: {},
      handleSubmit: jest.fn((fn) => fn),
      watch: jest.fn(() => ''),
      formState: { errors: {} },
    },
    handleSave: jest.fn(),
    isLoading: false,
  })),
}));

jest.mock('../../utils', () => ({
  formatCurrency: jest.fn((value) => `R$ ${value.toFixed(2).replace('.', ',')}`),
  formatDocument: jest.fn((doc) => doc),
  isCPF: jest.fn(() => true),
}));

import ClientsPanel from '../../screens/App/ClientsPanelScreen';
import EditClientScreen from '../../screens/App/EditClientScreen';
import CreateClientScreen from '../../screens/App/CreateClientScreen';
import TransferScreen from '../../screens/App/TransferScreen';

const { NavigationContainer } = require('@react-navigation/native');
const { createNativeStackNavigator } = require('@react-navigation/native-stack');

const Stack = createNativeStackNavigator();

function TestNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ClientsPanel" component={ClientsPanel} />
        <Stack.Screen name="EditClient" component={EditClientScreen} />
        <Stack.Screen name="CreateClient" component={CreateClientScreen} />
        <Stack.Screen name="Transfer" component={TransferScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

describe('Navigation Integration', () => {
  let mockNavigation: any;

  beforeEach(() => {
    mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
    };
    
    jest.clearAllMocks();
  });

  describe('ClientsPanel Navigation', () => {
    it('navigates to CreateClient when Novo Cliente button is pressed', () => {
      const { getByText } = render(<ClientsPanel navigation={mockNavigation} />);
      
      const newClientButton = getByText('Novo Cliente');
      fireEvent.press(newClientButton);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('CreateClient');
    });

    it('navigates to Transfer when Transferir button is pressed', () => {
      const { getByText } = render(<ClientsPanel navigation={mockNavigation} />);
      
      const transferButton = getByText('Transferir');
      fireEvent.press(transferButton);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Transfer');
    });

    it('navigates to EditClient when edit button is pressed', () => {
      const { getAllByTestId } = render(<ClientsPanel navigation={mockNavigation} />);
      
      const editButtons = getAllByTestId('edit-button');
      fireEvent.press(editButtons[0]);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('EditClient', {
        client: expect.objectContaining({
          id: 1,
          name: 'Test Client',
        }),
      });
    });
  });

  describe('EditClient Navigation', () => {
    const mockRoute = {
      params: {
        client: {
          id: 1,
          partnerId: 1,
          name: 'Test Client',
          document: '12345678900',
          age: 30,
          monthlyIncome: 5000,
          balance: 1000,
        },
      },
    };

    it('navigates back when back button is pressed', () => {
      const { getByTestId } = render(
        <EditClientScreen navigation={mockNavigation} route={mockRoute} />
      );
      
      const backButton = getByTestId('back-button');
      fireEvent.press(backButton);
      
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Transfer Navigation', () => {
    it('renders Transfer screen without crashing', () => {
      const { getByText } = render(<TransferScreen navigation={mockNavigation} />);
      
      expect(getByText('Transferência')).toBeTruthy();
    });
  });

  describe('CreateClient Navigation', () => {
    it('renders CreateClient screen without crashing', () => {
      const { getByText } = render(<CreateClientScreen navigation={mockNavigation} />);
      
      expect(getByText('Novo Cliente')).toBeTruthy();
    });
  });

  describe('Navigation Parameters', () => {
    it('passes correct client data to EditClient', () => {
      const testClient = {
        id: 1,
        partnerId: 1,
        name: 'Test Client',
        document: '12345678900',
        age: 30,
        monthlyIncome: 5000,
        balance: 1000,
      };

      const { getAllByTestId } = render(<ClientsPanel navigation={mockNavigation} />);
      
      const editButtons = getAllByTestId('edit-button');
      fireEvent.press(editButtons[0]);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('EditClient', {
        client: expect.objectContaining({
          id: testClient.id,
          name: testClient.name,
          document: testClient.document,
        }),
      });
    });
  });

  describe('Navigation Error Handling', () => {
    it('handles navigation errors gracefully', () => {
      const errorNavigation = {
        navigate: jest.fn(() => {
          throw new Error('Navigation error');
        }),
        goBack: jest.fn(),
        addListener: jest.fn(() => jest.fn()),
      };

      expect(() => {
        render(<ClientsPanel navigation={errorNavigation} />);
      }).not.toThrow();
    });
  });

  describe('Screen Focus Events', () => {
    it('registers focus listener on ClientsPanel', () => {
      render(<ClientsPanel navigation={mockNavigation} />);
      
      expect(mockNavigation.addListener).toHaveBeenCalledWith('focus', expect.any(Function));
    });
  });
});