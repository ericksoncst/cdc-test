import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../../screens/Login/LoginScreen';
import { useLoginViewModel } from '../../viewModels/useLoginViewModel';

import '../setup';

jest.mock('../../viewModels/useLoginViewModel');

jest.mock('../../components/input/Input', () => {
  const React = require('react');
  let inputCounter = 0;
  return React.forwardRef((props: any, ref: any) => {
    const { isPassword, placeholder, ...rest } = props;
    const testID = placeholder === 'E-mail' ? 'email-input' : 
                   placeholder === 'Senha' ? 'password-input' : 
                   `input-field-${inputCounter++}`;
    return React.createElement('TextInput', { 
      ...rest, 
      ref, 
      testID,
      secureTextEntry: isPassword,
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

describe('LoginScreen', () => {
  const mockUseLoginViewModel = useLoginViewModel as jest.MockedFunction<typeof useLoginViewModel>;

  const mockViewModel = {
    control: {} as any,
    errors: {},
    onSubmit: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    mockUseLoginViewModel.mockReturnValue(mockViewModel);
    jest.clearAllMocks();
  });

  it('renders correctly with all elements', () => {
    const { getByText, getByTestId } = render(<LoginScreen />);

    expect(getByText('CDC Bank')).toBeTruthy();
    expect(getByText('Portal do Parceiro')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
    expect(getByText('Use as credenciais do parceiro cadastrado')).toBeTruthy();
  });

  it('renders loading state correctly', () => {
    mockUseLoginViewModel.mockReturnValue({
      ...mockViewModel,
      isLoading: true,
    });

    const { getByText } = render(<LoginScreen />);

    expect(getByText('Entrando...')).toBeTruthy();
  });

  it('renders email validation error', () => {
    mockUseLoginViewModel.mockReturnValue({
      ...mockViewModel,
      errors: {
        email: { message: 'E-mail é obrigatório' },
      },
    });

    const { getByText } = render(<LoginScreen />);

    expect(getByText('E-mail é obrigatório')).toBeTruthy();
  });

  it('renders password validation error', () => {
    mockUseLoginViewModel.mockReturnValue({
      ...mockViewModel,
      errors: {
        password: { message: 'Senha é obrigatória' },
      },
    });

    const { getByText } = render(<LoginScreen />);

    expect(getByText('Senha é obrigatória')).toBeTruthy();
  });

  it('renders both validation errors', () => {
    mockUseLoginViewModel.mockReturnValue({
      ...mockViewModel,
      errors: {
        email: { message: 'Formato de e-mail inválido' },
        password: { message: 'Senha deve ter no mínimo 6 caracteres' },
      },
    });

    const { getByText } = render(<LoginScreen />);

    expect(getByText('Formato de e-mail inválido')).toBeTruthy();
    expect(getByText('Senha deve ter no mínimo 6 caracteres')).toBeTruthy();
  });

  it('disables button when loading', () => {
    mockUseLoginViewModel.mockReturnValue({
      ...mockViewModel,
      isLoading: true,
    });

    const { getByTestId } = render(<LoginScreen />);

    const button = getByTestId('button');
    expect(button.props.disabled).toBe(true);
  });

  it('enables button when not loading', () => {
    const { getByTestId } = render(<LoginScreen />);

    const button = getByTestId('button');
    expect(button.props.disabled).toBe(false);
  });

  it('calls onSubmit when login button is pressed', () => {
    const { getByTestId } = render(<LoginScreen />);

    const button = getByTestId('button');
    fireEvent.press(button);

    expect(mockViewModel.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows activity indicator when loading', () => {
    mockUseLoginViewModel.mockReturnValue({
      ...mockViewModel,
      isLoading: true,
    });

    const { getByTestId } = render(<LoginScreen />);

    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('does not show activity indicator when not loading', () => {
    const { queryByTestId } = render(<LoginScreen />);

    expect(queryByTestId('activity-indicator')).toBeNull();
  });

  it('has correct input props for email field', () => {
    const { getByTestId } = render(<LoginScreen />);

    const emailInput = getByTestId('email-input');
    expect(emailInput.props.placeholder).toBe('E-mail');
    expect(emailInput.props.keyboardType).toBe('email-address');
    expect(emailInput.props.autoCapitalize).toBe('none');
    expect(emailInput.props.autoCorrect).toBe(false);
  });

  it('has correct input props for password field', () => {
    const { getByTestId } = render(<LoginScreen />);

    const passwordInput = getByTestId('password-input');
    expect(passwordInput.props.placeholder).toBe('Senha');
    expect(passwordInput.props.secureTextEntry).toBe(true);
    expect(passwordInput.props.autoCapitalize).toBe('none');
  });
});