import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../components/input/Input';
import Button from '../components/Button/Button';

export const LoginScreen: React.FC = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    return (
         <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>CDC Bank</Text>
                <Text style={styles.subtitle}>Portal do Parceiro</Text>
            </View>
            <View style={styles.form}>
              <Input 
                placeholder="E-mail" 
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Input 
                placeholder="Senha" 
                value={password}
                onChangeText={setPassword}
                isPassword
                autoCapitalize="none"
              />

              <Button title='Entrar' onPress={() => {}} disabled={false} />
            </View>
        </View>
    )
}

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
    marginVertical: 10
  }
});