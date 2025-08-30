import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaskInput, { Masks } from 'react-native-mask-input';

interface InputProps extends TextInputProps {
  isPassword?: boolean;
  useMask?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  isPassword = false, 
  useMask = false,
  value: propValue,
  onChangeText: propOnChangeText,
  ...rest 
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [internalValue, setInternalValue] = useState('');
  
  const value = propValue !== undefined ? propValue : internalValue;
  const onChangeText = propOnChangeText || setInternalValue;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const dynamicMask = (rawValue: string) => {
    if (isPassword || !useMask) return undefined;
    const digits = rawValue.replace(/\D/g, '');
    if (digits.length > 11) return Masks.BRL_CNPJ;
    return Masks.BRL_CPF;
  };

  const handleChangeText = (masked: string, unmasked: string) => {
    if (useMask && !isPassword) {
      onChangeText(masked);
    } else {
      onChangeText(masked);
    }
  };

  return (
    <View style={styles.container} testID="input-container">
      <MaskInput
        style={styles.input}
        value={value}
        onChangeText={handleChangeText}
        mask={dynamicMask(value)}
        secureTextEntry={isPassword && !showPassword}
        placeholderTextColor="#999"
        testID="input-field"
        {...rest}
      />
      {isPassword && (
        <TouchableOpacity 
          style={styles.icon} 
          onPress={toggleShowPassword}
          testID="password-toggle"
        >
          <Icon name={showPassword ? 'eye' : 'eye-off'} size={20} color="#555" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: '#fff',
    marginVertical: 5
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginLeft: 8,
  },
});

export default Input;
