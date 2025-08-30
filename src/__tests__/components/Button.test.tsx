import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../components/Button/Button';

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders correctly with title', () => {
    const { getByTestId, getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );

    expect(getByTestId('button')).toBeTruthy();
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );

    fireEvent.press(getByTestId('button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders as disabled when disabled prop is true', () => {
    const { getByTestId } = render(
      <Button title="Disabled Button" onPress={mockOnPress} disabled={true} />
    );

    const button = getByTestId('button');
    expect(button).toBeTruthy();
    expect(button.props.disabled).toBe(true);
  });

  it('does not call onPress when disabled and pressed', () => {
    const { getByTestId } = render(
      <Button title="Disabled Button" onPress={mockOnPress} disabled={true} />
    );

    fireEvent.press(getByTestId('button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('renders as enabled by default when disabled prop is not provided', () => {
    const { getByTestId } = render(
      <Button title="Default Button" onPress={mockOnPress} />
    );

    const button = getByTestId('button');
    expect(button.props.disabled).toBe(false);
  });

  it('renders with different titles correctly', () => {
    const { getByText, rerender } = render(
      <Button title="First Title" onPress={mockOnPress} />
    );

    expect(getByText('First Title')).toBeTruthy();

    rerender(<Button title="Second Title" onPress={mockOnPress} />);
    expect(getByText('Second Title')).toBeTruthy();
  });

  it('has correct test ID for accessibility testing', () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );

    expect(getByTestId('button')).toBeTruthy();
  });
});