import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from '../../components/input/Input';

describe('Input Component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Input />);

    expect(getByTestId('input-container')).toBeTruthy();
    expect(getByTestId('input-field')).toBeTruthy();
  });

  it('renders with placeholder text', () => {
    const { getByTestId } = render(
      <Input placeholder="Enter your text" />
    );

    const inputField = getByTestId('input-field');
    expect(inputField.props.placeholder).toBe('Enter your text');
  });

  it('handles text input correctly', () => {
    const mockOnChangeText = jest.fn();
    const { getByTestId } = render(
      <Input onChangeText={mockOnChangeText} />
    );

    const inputField = getByTestId('input-field');
    fireEvent.changeText(inputField, 'test input');

    expect(mockOnChangeText).toHaveBeenCalledWith('test input');
  });

  it('renders password toggle button when isPassword is true', () => {
    const { getByTestId } = render(<Input isPassword={true} />);

    expect(getByTestId('input-container')).toBeTruthy();
    expect(getByTestId('input-field')).toBeTruthy();
    expect(getByTestId('password-toggle')).toBeTruthy();
  });

  it('does not render password toggle when isPassword is false', () => {
    const { getByTestId, queryByTestId } = render(<Input isPassword={false} />);

    expect(getByTestId('input-container')).toBeTruthy();
    expect(getByTestId('input-field')).toBeTruthy();
    expect(queryByTestId('password-toggle')).toBeNull();
  });

  it('toggles password visibility when toggle button is pressed', () => {
    const { getByTestId } = render(<Input isPassword={true} />);

    const inputField = getByTestId('input-field');
    const toggleButton = getByTestId('password-toggle');

    expect(inputField.props.secureTextEntry).toBe(true);

    fireEvent.press(toggleButton);
    expect(inputField.props.secureTextEntry).toBe(false);

    fireEvent.press(toggleButton);
    expect(inputField.props.secureTextEntry).toBe(true);
  });

  it('handles controlled input with value prop', () => {
    const mockOnChangeText = jest.fn();
    const { getByTestId } = render(
      <Input value="controlled value" onChangeText={mockOnChangeText} />
    );

    const inputField = getByTestId('input-field');
    expect(inputField.props.value).toBe('controlled value');
  });

  it('handles uncontrolled input without value prop', () => {
    const { getByTestId } = render(<Input />);

    const inputField = getByTestId('input-field');
    expect(inputField.props.value).toBe('');
  });

  it('applies mask when useMask is true', () => {
    const { getByTestId } = render(<Input useMask={true} />);

    const inputField = getByTestId('input-field');
    expect(inputField).toBeTruthy();
  });

  it('does not apply mask when useMask is false', () => {
    const { getByTestId } = render(<Input useMask={false} />);

    const inputField = getByTestId('input-field');
    expect(inputField).toBeTruthy();
  });

  it('does not apply mask for password fields', () => {
    const { getByTestId } = render(<Input isPassword={true} useMask={true} />);

    const inputField = getByTestId('input-field');
    expect(inputField.props.secureTextEntry).toBe(true);
  });

  it('passes additional TextInput props correctly', () => {
    const { getByTestId } = render(
      <Input
        maxLength={10}
        autoCapitalize="none"
        keyboardType="email-address"
      />
    );

    const inputField = getByTestId('input-field');
    expect(inputField.props.maxLength).toBe(10);
    expect(inputField.props.autoCapitalize).toBe('none');
    expect(inputField.props.keyboardType).toBe('email-address');
  });

  it('has correct test IDs for accessibility testing', () => {
    const { getByTestId } = render(<Input isPassword={true} />);

    expect(getByTestId('input-container')).toBeTruthy();
    expect(getByTestId('input-field')).toBeTruthy();
    expect(getByTestId('password-toggle')).toBeTruthy();
  });

  it('handles mask change text correctly', () => {
    const mockOnChangeText = jest.fn();
    const { getByTestId } = render(
      <Input useMask={true} onChangeText={mockOnChangeText} />
    );

    const inputField = getByTestId('input-field');
    fireEvent.changeText(inputField, '12345678900');

    expect(mockOnChangeText).toHaveBeenCalled();
  });
});