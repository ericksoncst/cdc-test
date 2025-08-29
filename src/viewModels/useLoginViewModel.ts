import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { LoginFormValues, loginSchema } from '../screens/Login/schema';
import { ApiService } from '../services/api';

export const useLoginViewModel = () => {
  const { isLoading } = useAuth();
  const { login } = ApiService;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      const success = await login(email, password);
      console.log('Login success:', success);
      if (!success) {
        Alert.alert('Erro', 'Credenciais inválidas. Verifique seu e-mail e senha.');
        return;
      }
      reset();
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Erro', 'Erro ao fazer login. Tente novamente.');
    }
  });

  return {
    control,
    errors,
    onSubmit,
    isLoading,
    reset,
  };
};
