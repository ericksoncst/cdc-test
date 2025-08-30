import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TransferScreen from '../../screens/App/TransferScreen';
import { useTransferViewModel } from '../../viewModels/useTransferViewModel';

import '../setup';

jest.mock('react-native-vector-icons/Feather', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    return React.createElement('Text', { ...props, ref }, props.name);
  });
});

jest.mock('../../viewModels/useTransferViewModel');
jest.mock('../../components/input/Input', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    const { placeholder, ...rest } = props;
    const testID = placeholder === '0,00' ? 'amount-input' : 'input-field';
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

describe('TransferScreen', () => {
  const mockUseTransferViewModel = useTransferViewModel as jest.MockedFunction<typeof useTransferViewModel>;
  
  const mockNavigation = {
    goBack: jest.fn(),
  };

  const mockClients = [
    {
      id: 2,
      name: 'Ana Costa X',
      document: '98765432100',
      balance: 3000,
    },
    {
      id: 3,
      name: 'Carlos Ferreira',
      document: '11122233300',
      balance: 1140.25,
    },
  ];

  const mockViewModel = {
    control: {} as any,
    errors: {},
    handleSubmit: jest.fn(),
    isLoading: false,
    clients: mockClients,
    fromClient: null,
    toClient: null,
    showFromModal: false,
    showToModal: false,
    setShowFromModal: jest.fn(),
    setShowToModal: jest.fn(),
    setValue: jest.fn(),
  };

  beforeEach(() => {
    mockUseTransferViewModel.mockReturnValue(mockViewModel);
    jest.clearAllMocks();
  });

  it('renders correctly with all elements', () => {
    const { getByText } = render(<TransferScreen navigation={mockNavigation} />);

    expect(getByText('Transferência')).toBeTruthy();
    expect(getByText('Cliente de Origem *')).toBeTruthy();
    expect(getByText('Cliente de Destino *')).toBeTruthy();
    expect(getByText('Valor da Transferência *')).toBeTruthy();
    expect(getByText('Realizar Transferência')).toBeTruthy();
  });

  it('shows loading state correctly', () => {
    mockUseTransferViewModel.mockReturnValue({
      ...mockViewModel,
      isLoading: true,
    });

    const { getByText } = render(<TransferScreen navigation={mockNavigation} />);

    expect(getByText('Transferindo...')).toBeTruthy();
  });

  it('calls navigation.goBack when back button is pressed', () => {
    const { getByTestId } = render(<TransferScreen navigation={mockNavigation} />);

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('opens from client modal when selector is pressed', () => {
    const { getByTestId } = render(<TransferScreen navigation={mockNavigation} />);

    const fromClientSelector = getByTestId('from-client-selector');
    fireEvent.press(fromClientSelector);

    expect(mockViewModel.setShowFromModal).toHaveBeenCalledWith(true);
  });

  it('opens to client modal when selector is pressed', () => {
    const { getByTestId } = render(<TransferScreen navigation={mockNavigation} />);

    const toClientSelector = getByTestId('to-client-selector');
    fireEvent.press(toClientSelector);

    expect(mockViewModel.setShowToModal).toHaveBeenCalledWith(true);
  });

  it('displays selected from client correctly', () => {
    mockUseTransferViewModel.mockReturnValue({
      ...mockViewModel,
      fromClient: mockClients[0],
    });

    const { getByText } = render(<TransferScreen navigation={mockNavigation} />);

    expect(getByText('Ana Costa X')).toBeTruthy();
  });

  it('displays selected to client correctly', () => {
    mockUseTransferViewModel.mockReturnValue({
      ...mockViewModel,
      toClient: mockClients[1],
    });

    const { getByText } = render(<TransferScreen navigation={mockNavigation} />);

    expect(getByText('Carlos Ferreira')).toBeTruthy();
  });

  it('shows placeholder when no from client selected', () => {
    const { getByText } = render(<TransferScreen navigation={mockNavigation} />);

    expect(getByText('Selecionar cliente de origem')).toBeTruthy();
  });

  it('shows placeholder when no to client selected', () => {
    const { getByText } = render(<TransferScreen navigation={mockNavigation} />);

    expect(getByText('Selecionar cliente de destino')).toBeTruthy();
  });

  it('renders validation errors correctly', () => {
    mockUseTransferViewModel.mockReturnValue({
      ...mockViewModel,
      errors: {
        amount: { message: 'Valor é obrigatório' },
      },
    });

    const { getByText } = render(<TransferScreen navigation={mockNavigation} />);

    expect(getByText('Valor é obrigatório')).toBeTruthy();
  });

  it('disables button when loading', () => {
    mockUseTransferViewModel.mockReturnValue({
      ...mockViewModel,
      isLoading: true,
    });

    const { getByTestId } = render(<TransferScreen navigation={mockNavigation} />);

    const button = getByTestId('button');
    expect(button.props.disabled).toBe(true);
  });

  it('disables button when no from client selected', () => {
    mockUseTransferViewModel.mockReturnValue({
      ...mockViewModel,
      fromClient: null,
      toClient: mockClients[1],
    });

    const { getByTestId } = render(<TransferScreen navigation={mockNavigation} />);

    const button = getByTestId('button');
    expect(button.props.disabled).toBe(true);
  });

  it('disables button when no to client selected', () => {
    mockUseTransferViewModel.mockReturnValue({
      ...mockViewModel,
      fromClient: mockClients[0],
      toClient: null,
    });

    const { getByTestId } = render(<TransferScreen navigation={mockNavigation} />);

    const button = getByTestId('button');
    expect(button.props.disabled).toBe(true);
  });

  it('enables button when both clients selected and not loading', () => {
    mockUseTransferViewModel.mockReturnValue({
      ...mockViewModel,
      fromClient: mockClients[0],
      toClient: mockClients[1],
      isLoading: false,
    });

    const { getByTestId } = render(<TransferScreen navigation={mockNavigation} />);

    const button = getByTestId('button');
    expect(button.props.disabled).toBe(false);
  });

  it('calls handleSubmit when transfer button is pressed', () => {
    mockUseTransferViewModel.mockReturnValue({
      ...mockViewModel,
      fromClient: mockClients[0],
      toClient: mockClients[1],
    });

    const { getByTestId } = render(<TransferScreen navigation={mockNavigation} />);

    const button = getByTestId('button');
    fireEvent.press(button);

    expect(mockViewModel.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows from client modal when showFromModal is true', () => {
    mockUseTransferViewModel.mockReturnValue({
      ...mockViewModel,
      showFromModal: true,
    });

    const { getByText } = render(<TransferScreen navigation={mockNavigation} />);

    expect(getByText('Selecionar Cliente')).toBeTruthy();
  });

  it('shows to client modal when showToModal is true', () => {
    mockUseTransferViewModel.mockReturnValue({
      ...mockViewModel,
      showToModal: true,
    });

    const { getByText } = render(<TransferScreen navigation={mockNavigation} />);

    expect(getByText('Selecionar Cliente')).toBeTruthy();
  });

  it('has correct input props for amount field', () => {
    const { getByTestId } = render(<TransferScreen navigation={mockNavigation} />);

    const amountInput = getByTestId('amount-input');
    expect(amountInput.props.placeholder).toBe('0,00');
    expect(amountInput.props.keyboardType).toBe('numeric');
  });
});