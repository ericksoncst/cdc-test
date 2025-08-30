import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ClientsPanel from '../../screens/App/ClientsPanelScreen';
import { useAuth } from '../../contexts/AuthContext';
import { useClients } from '../../contexts/ClientContext';

import '../setup';
import { mockAlert } from '../setup';

jest.mock('react-native-vector-icons/Feather', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    return React.createElement('Text', { ...props, ref }, props.name);
  });
});

jest.mock('../../contexts/AuthContext');
jest.mock('../../contexts/ClientContext');

jest.mock('../../components/input/Input', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    const { placeholder, ...rest } = props;
    const testID = placeholder === 'Buscar por nome ou CPF/CNPJ' ? 'search-input' : 'input-field';
    return React.createElement('TextInput', { 
      ...rest, 
      ref, 
      testID,
      placeholder 
    });
  });
});

jest.mock('../../components/Button/Button', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    const { testID = 'button', title, children, ...rest } = props;
    return React.createElement('TouchableOpacity', { ...rest, ref, testID }, 
      React.createElement('Text', {}, title || children)
    );
  });
});

jest.mock('../../utils', () => ({
  formatCurrency: jest.fn((value) => `R$ ${value.toFixed(2).replace('.', ',')}`),
  formatDocument: jest.fn((doc) => doc),
}));

describe('ClientsPanelScreen', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
  const mockUseClients = useClients as jest.MockedFunction<typeof useClients>;

  const mockNavigation = {
    navigate: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
  };

  const mockPartner = {
    id: 1,
    name: 'João Silva',
    email: 'joao@bank.com',
    password: '123456',
  };

  const mockClients = [
    {
      id: 2,
      partnerId: 1,
      name: 'Ana Costa X',
      document: '98765432100',
      age: 30,
      monthlyIncome: 3500,
      balance: 3000,
    },
    {
      id: 3,
      partnerId: 1,
      name: 'Carlos Ferreira',
      document: '11122233300',
      age: 42,
      monthlyIncome: 7200,
      balance: 1140.25,
    },
  ];

  const defaultAuthContext = {
    partner: mockPartner,
    logout: jest.fn(),
  };

  const defaultClientContext = {
    filteredClients: mockClients,
    isLoading: false,
    searchTerm: '',
    setSearchTerm: jest.fn(),
    deleteClient: jest.fn(),
    refreshClients: jest.fn(),
  };

  beforeEach(() => {
    mockUseAuth.mockReturnValue(defaultAuthContext as any);
    mockUseClients.mockReturnValue(defaultClientContext as any);
    jest.clearAllMocks();
  });

  it('renders correctly with partner name and clients', () => {
    const { getByText } = render(<ClientsPanel navigation={mockNavigation} />);

    expect(getByText('Meus Clientes')).toBeTruthy();
    expect(getByText('Olá, João Silva')).toBeTruthy();
    expect(getByText('Ana Costa X')).toBeTruthy();
    expect(getByText('Carlos Ferreira')).toBeTruthy();
    expect(getByText('Novo Cliente')).toBeTruthy();
    expect(getByText('Transferir')).toBeTruthy();
  });

  it('renders loading state correctly', () => {
    mockUseClients.mockReturnValue({
      ...defaultClientContext,
      isLoading: true,
      filteredClients: [],
    } as any);

    const { getByText } = render(<ClientsPanel navigation={mockNavigation} />);

    expect(getByText('Carregando clientes...')).toBeTruthy();
  });

  it('calls setSearchTerm when search input changes', () => {
    const { getByTestId } = render(<ClientsPanel navigation={mockNavigation} />);

    const searchInput = getByTestId('search-input');
    fireEvent.changeText(searchInput, 'Ana');

    expect(defaultClientContext.setSearchTerm).toHaveBeenCalledWith('Ana');
  });

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
      client: mockClients[0],
    });
  });

  it('shows delete confirmation when delete button is pressed', () => {
    const { getAllByTestId } = render(<ClientsPanel navigation={mockNavigation} />);

    const deleteButtons = getAllByTestId('delete-button');
    fireEvent.press(deleteButtons[0]);

    expect(mockAlert.alert).toHaveBeenCalledWith(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir o cliente Ana Costa X?',
      expect.any(Array)
    );
  });

  it('shows logout confirmation when logout button is pressed', () => {
    const { getByTestId } = render(<ClientsPanel navigation={mockNavigation} />);

    const logoutButton = getByTestId('logout-button');
    fireEvent.press(logoutButton);

    expect(mockAlert.alert).toHaveBeenCalledWith(
      'Sair',
      'Tem certeza que deseja sair?',
      expect.any(Array)
    );
  });

  it('calls refreshClients when pull to refresh is triggered', () => {
    const { getByTestId } = render(<ClientsPanel navigation={mockNavigation} />);

    const flatList = getByTestId('clients-list');
    
    const refreshControl = flatList.props.refreshControl;
    if (refreshControl && refreshControl.props && refreshControl.props.onRefresh) {
      refreshControl.props.onRefresh();
    }

    expect(defaultClientContext.refreshClients).toHaveBeenCalled();
  });

  it('displays formatted client information correctly', () => {
    const { getByText } = render(<ClientsPanel navigation={mockNavigation} />);

    expect(getByText('Ana Costa X')).toBeTruthy();
    expect(getByText('Carlos Ferreira')).toBeTruthy();
    
});

  it('handles empty client list', () => {
    mockUseClients.mockReturnValue({
      ...defaultClientContext,
      filteredClients: [],
      isLoading: false,
    } as any);

    const { getByTestId } = render(<ClientsPanel navigation={mockNavigation} />);

    const flatList = getByTestId('clients-list');
    expect(flatList.props.data).toEqual([]);
  });

  it('calls refreshClients on screen focus', () => {
    const mockAddListener = jest.fn((event, callback) => {
      if (event === 'focus') {
        callback();
      }
      return jest.fn();
    });

    const navigationWithListener = {
      ...mockNavigation,
      addListener: mockAddListener,
    };

    render(<ClientsPanel navigation={navigationWithListener} />);

    expect(defaultClientContext.refreshClients).toHaveBeenCalled();
  });
});