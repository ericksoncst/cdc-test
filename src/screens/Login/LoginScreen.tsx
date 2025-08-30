import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Controller } from 'react-hook-form';
import { useLoginViewModel } from '../../viewModels/useLoginViewModel';
import Input from '../../components/input/Input';
import Button from '../../components/Button/Button';


export const LoginScreen: React.FC = () => {
  const { control, errors, onSubmit, isLoading } = useLoginViewModel();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CDC Bank</Text>
        <Text style={styles.subtitle}>Portal do Parceiro</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="E-mail"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
          />
          {errors.email?.message ? (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Senha"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                isPassword
                autoCapitalize="none"
              />
            )}
          />
          {errors.password?.message ? (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          ) : null}
        </View>

        <Button
          title={isLoading ? 'Entrando...' : 'Entrar'}
          onPress={onSubmit}
          disabled={isLoading}
        />

        {isLoading && (
          <ActivityIndicator size="small" color="#007AFF" style={styles.loading} testID="activity-indicator" />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Use as credenciais do parceiro cadastrado</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 60
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500'
  },
  form: {
    flex: 1
  },
  inputContainer: {
    marginBottom: 20
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 10
  },
  loading: {
    marginTop: 20
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  }
});
