import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateClientScreen from '../../screens/App/CreateClientScreen';
import { useCreateClientViewModel } from '../../viewModels/useCreateClientViewModel';
import { isCPF } from '../../utils';

import '../setup';

jest.mock('react-native-vector-icons/Feather', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    return React.createElement('Text', { ...props, ref }, props.name);
  });
});

jest.mock('../../viewModels/useCreateClientViewModel');
jest.mock('../../utils');

jest.mock('../../components/input/Input', () => {
  const React = require('react');
  let inputCounter = 0;
  return React.forwardRef((props: any, ref: any) => {
    const { placeholder, useMask, ...rest } = props;
    const testID = placeholder === 'Nome completo' ? 'name-input' :
                   placeholder === '000.000.000-00 ou 00.000.000/0000-00' ? 'document-input' :
                   placeholder === 'Idade em anos' ? 'age-input' :
                   placeholder === 'DD/MM/AAAA' ? 'foundation-date-input' :
                   placeholder === 'R$ 0,00' ? 'income-input' :
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

describe('CreateClientScreen', () => {
  const mockUseCreateClientViewModel = useCreateClientViewModel as jest.MockedFunction<typeof useCreateClientViewModel>;
  const mockIsCPF = isCPF as jest.MockedFunction<typeof isCPF>;
  
  const mockNavigation = {
    goBack: jest.fn(),
  };

  const mockForm = {
    control: {} as any,
    handleSubmit: jest.fn((callback) => callback),
    watch: jest.fn(),
    formState: { errors: {} },
  };

  const mockViewModel = {
    form: mockForm,
    handleSave: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    mockUseCreateClientViewModel.mockReturnValue(mockViewModel);
    mockIsCPF.mockReturnValue(true);
    mockForm.watch.mockReturnValue('12345678900');
    jest.clearAllMocks();
  });

  it('renders correctly with all form fields for CPF', () => {
    const { getByText } = render(<CreateClientScreen navigation={mockNavigation} />);

    expect(getByText('Novo Cliente')).toBeTruthy();
    expect(getByText('Nome *')).toBeTruthy();
    expect(getByText('CPF/CNPJ *')).toBeTruthy();
    expect(getByText('Idade *')).toBeTruthy();
    expect(getByText('Renda Mensal *')).toBeTruthy();
    expect(getByText('Salvar Cliente')).toBeTruthy();
    expect(getByText('O saldo inicial do cliente será R$ 0,00')).toBeTruthy();
  });

  it('renders foundation date field for CNPJ', () => {
    mockIsCPF.mockReturnValue(false);
    mockForm.watch.mockReturnValue('12345678000190');

    const { getByText, queryByText } = render(<CreateClientScreen navigation={mockNavigation} />);

    expect(getByText('Data de Fundação *')).toBeTruthy();
    expect(queryByText('Idade *')).toBeNull();
  });

  it('shows loading state correctly', () => {
    mockUseCreateClientViewModel.mockReturnValue({
      ...mockViewModel,
      isLoading: true,
    });

    const { getByText } = render(<CreateClientScreen navigation={mockNavigation} />);

    expect(getByText('Salvando...')).toBeTruthy();
  });

  it('calls navigation.goBack when back button is pressed', () => {
    const { getByTestId } = render(<CreateClientScreen navigation={mockNavigation} />);

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('calls handleSave when save button is pressed', () => {
    const { getByTestId } = render(<CreateClientScreen navigation={mockNavigation} />);

    const saveButton = getByTestId('button');
    fireEvent.press(saveButton);

    expect(mockViewModel.handleSave).toHaveBeenCalledTimes(1);
  });

  it('renders validation errors correctly', () => {
    const mockFormWithErrors = {
      ...mockForm,
      formState: {
        errors: {
          name: { message: 'Nome é obrigatório' },
          document: { message: 'CPF/CNPJ é obrigatório' },
          age: { message: 'Idade é obrigatória' },
          monthlyIncome: { message: 'Renda mensal é obrigatória' },
        },
      },
    };

    mockUseCreateClientViewModel.mockReturnValue({
      ...mockViewModel,
      form: mockFormWithErrors,
    });

    const { getByText } = render(<CreateClientScreen navigation={mockNavigation} />);

    expect(getByText('Nome é obrigatório')).toBeTruthy();
    expect(getByText('CPF/CNPJ é obrigatório')).toBeTruthy();
    expect(getByText('Idade é obrigatória')).toBeTruthy();
    expect(getByText('Renda mensal é obrigatória')).toBeTruthy();
  });

  it('renders foundation date error for CNPJ', () => {
    mockIsCPF.mockReturnValue(false);
    mockForm.watch.mockReturnValue('12345678000190');
    
    const mockFormWithErrors = {
      ...mockForm,
      formState: {
        errors: {
          foundationDate: { message: 'Data de fundação é obrigatória' },
        },
      },
    };

    mockUseCreateClientViewModel.mockReturnValue({
      ...mockViewModel,
      form: mockFormWithErrors,
    });

    const { getByText } = render(<CreateClientScreen navigation={mockNavigation} />);

    expect(getByText('Data de fundação é obrigatória')).toBeTruthy();
  });

  it('disables save button when loading', () => {
    mockUseCreateClientViewModel.mockReturnValue({
      ...mockViewModel,
      isLoading: true,
    });

    const { getByTestId } = render(<CreateClientScreen navigation={mockNavigation} />);

    const saveButton = getByTestId('button');
    expect(saveButton.props.disabled).toBe(true);
  });

  it('enables save button when not loading', () => {
    const { getByTestId } = render(<CreateClientScreen navigation={mockNavigation} />);

    const saveButton = getByTestId('button');
    expect(saveButton.props.disabled).toBe(false);
  });

  it('has correct input props for name field', () => {
    const { getByTestId } = render(<CreateClientScreen navigation={mockNavigation} />);

    const nameInput = getByTestId('name-input');
    expect(nameInput.props.placeholder).toBe('Nome completo');
    expect(nameInput.props.autoCapitalize).toBe('words');
  });

  it('has correct input props for document field', () => {
    const { getByTestId } = render(<CreateClientScreen navigation={mockNavigation} />);

    const documentInput = getByTestId('document-input');
    expect(documentInput.props.placeholder).toBe('000.000.000-00 ou 00.000.000/0000-00');
    expect(documentInput.props.keyboardType).toBe('numeric');
  });

  it('has correct input props for age field when CPF', () => {
    const { getByTestId } = render(<CreateClientScreen navigation={mockNavigation} />);

    const ageInput = getByTestId('age-input');
    expect(ageInput.props.placeholder).toBe('Idade em anos');
    expect(ageInput.props.keyboardType).toBe('numeric');
  });

  it('has correct input props for foundation date when CNPJ', () => {
    mockIsCPF.mockReturnValue(false);
    mockForm.watch.mockReturnValue('12345678000190');

    const { getByTestId } = render(<CreateClientScreen navigation={mockNavigation} />);

    const foundationDateInput = getByTestId('foundation-date-input');
    expect(foundationDateInput.props.placeholder).toBe('DD/MM/AAAA');
    expect(foundationDateInput.props.keyboardType).toBe('numeric');
  });

  it('has correct input props for monthly income field', () => {
    const { getByTestId } = render(<CreateClientScreen navigation={mockNavigation} />);

    const monthlyIncomeInput = getByTestId('income-input');
    expect(monthlyIncomeInput.props.placeholder).toBe('R$ 0,00');
    expect(monthlyIncomeInput.props.keyboardType).toBe('numeric');
  });
});