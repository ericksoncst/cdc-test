import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditClientScreen from '../../screens/App/EditClientScreen';
import { useEditClientViewModel } from '../../viewModels/useEditClientViewModel';
import { formatDocument } from '../../utils';

import '../setup';
import { mockAlert } from '../setup';

jest.mock('react-native-vector-icons/Feather', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    return React.createElement('Text', { ...props, ref }, props.name);
  });
});

jest.mock('../../viewModels/useEditClientViewModel');
jest.mock('../../utils');
jest.mock('../../components/input/Input', () => {
  const React = require('react');
  let inputCounter = 0;
  return React.forwardRef((props: any, ref: any) => {
    const { placeholder, ...rest } = props;
    const testID = placeholder === 'Nome completo' ? 'name-input' :
                   placeholder === 'Idade em anos' ? 'age-input' :
                   placeholder === 'DD/MM/AAAA' ? 'foundation-date-input' :
                   placeholder === '0.00' ? 'income-input' :
                   `input-field-${inputCounter++}`;
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

describe('EditClientScreen', () => {
  const mockUseEditClientViewModel = useEditClientViewModel as jest.MockedFunction<typeof useEditClientViewModel>;
  const mockFormatDocument = formatDocument as jest.MockedFunction<typeof formatDocument>;
  
  const mockNavigation = {
    goBack: jest.fn(),
  };

  const mockClient = {
    id: 2,
    partnerId: 1,
    name: 'Ana Costa X',
    document: '98765432100',
    age: 30,
    monthlyIncome: 3500,
    balance: 3000,
  };

  const mockRoute = {
    params: {
      client: mockClient,
    },
  };

  const mockViewModel = {
    control: {} as any,
    handleSubmit: jest.fn((callback) => callback),
    onSubmit: jest.fn(),
    isLoading: false,
    isPersonalDocument: true,
  };

  beforeEach(() => {
    mockUseEditClientViewModel.mockReturnValue(mockViewModel);
    mockFormatDocument.mockReturnValue('987.654.321-00');
    jest.clearAllMocks();
  });

  it('renders correctly with all form fields for CPF', () => {
    const { getByText } = render(
      <EditClientScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Editar Cliente')).toBeTruthy();
    expect(getByText('Nome *')).toBeTruthy();
    expect(getByText('CPF/CNPJ')).toBeTruthy();
    expect(getByText('Idade *')).toBeTruthy();
    expect(getByText('Renda Mensal *')).toBeTruthy();
    expect(getByText('Saldo Atual:')).toBeTruthy();
    expect(getByText('Salvar Alterações')).toBeTruthy();
  });

  it('renders foundation date field for CNPJ', () => {
    mockUseEditClientViewModel.mockReturnValue({
      ...mockViewModel,
      isPersonalDocument: false,
    });

    const { getByText, queryByText } = render(
      <EditClientScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Data de Fundação *')).toBeTruthy();
    expect(queryByText('Idade *')).toBeNull();
  });

  it('displays client document as disabled field', () => {
    const { getByText } = render(
      <EditClientScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('987.654.321-00')).toBeTruthy();
    expect(getByText('O CPF/CNPJ não pode ser alterado')).toBeTruthy();
  });

  it('displays formatted balance correctly', () => {
    const { getByText } = render(
      <EditClientScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('R$ 3.000,00')).toBeTruthy();
  });

  it('shows loading state correctly', () => {
    mockUseEditClientViewModel.mockReturnValue({
      ...mockViewModel,
      isLoading: true,
    });

    const { getByText } = render(
      <EditClientScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Salvando...')).toBeTruthy();
  });

  it('calls navigation.goBack when back button is pressed', () => {
    const { getByTestId } = render(
      <EditClientScreen navigation={mockNavigation} route={mockRoute} />
    );

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when save button is pressed', () => {
    const { getByTestId } = render(
      <EditClientScreen navigation={mockNavigation} route={mockRoute} />
    );

    const saveButton = getByTestId('button');
    fireEvent.press(saveButton);

    expect(mockViewModel.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables save button when loading', () => {
    mockUseEditClientViewModel.mockReturnValue({
      ...mockViewModel,
      isLoading: true,
    });

    const { getByTestId } = render(
      <EditClientScreen navigation={mockNavigation} route={mockRoute} />
    );

    const saveButton = getByTestId('button');
    expect(saveButton.props.disabled).toBe(true);
  });

  it('enables save button when not loading', () => {
    const { getByTestId } = render(
      <EditClientScreen navigation={mockNavigation} route={mockRoute} />
    );

    const saveButton = getByTestId('button');
    expect(saveButton.props.disabled).toBe(false);
  });

  it('formats balance with correct currency formatting', () => {
    const clientWithLargeBalance = {
      ...mockClient,
      balance: 1234567.89,
    };

    const routeWithLargeBalance = {
      params: {
        client: clientWithLargeBalance,
      },
    };

    const { getByText } = render(
      <EditClientScreen navigation={mockNavigation} route={routeWithLargeBalance} />
    );

    expect(getByText('R$ 1.234.567,89')).toBeTruthy();
  });

  it('passes client and success callback to useEditClientViewModel', () => {
    render(<EditClientScreen navigation={mockNavigation} route={mockRoute} />);

    expect(mockUseEditClientViewModel).toHaveBeenCalledWith(
      mockClient,
      expect.any(Function)
    );
  });

  it('calls Alert.alert when success callback is triggered', () => {
    render(<EditClientScreen navigation={mockNavigation} route={mockRoute} />);
    
    const successCallback = mockUseEditClientViewModel.mock.calls[0][1];
    
    successCallback();

    expect(mockAlert.alert).toHaveBeenCalledWith(
      'Sucesso',
      'Cliente atualizado com sucesso!',
      [{ text: 'OK', onPress: expect.any(Function) }]
    );
  });

  it('calls navigation.goBack when Alert OK is pressed', () => {
    render(<EditClientScreen navigation={mockNavigation} route={mockRoute} />);
    
    const successCallback = mockUseEditClientViewModel.mock.calls[0][1];
    
    successCallback();

    const alertCall = mockAlert.alert.mock.calls[0];
    const okButton = alertCall[2][0];
    okButton.onPress();

    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });
});