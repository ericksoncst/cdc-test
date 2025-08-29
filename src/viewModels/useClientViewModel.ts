import { useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useClients } from '../contexts/ClientContext';
import { Client } from '../types';


export const useClientsPanelViewModel = (navigation: any) => {
  const { partner, logout } = useAuth();
  const {
    filteredClients,
    isLoading,
    searchTerm,
    setSearchTerm,
    deleteClient,
    refreshClients,
  } = useClients();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', refreshClients);
    return unsubscribe;
  }, [navigation, refreshClients]);

  const handleDeleteClient = useCallback(
    (client: Client) => {
      Alert.alert(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o cliente ${client.name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              const success = await deleteClient(client.id);
              if (success) {
                Alert.alert('Sucesso', 'Cliente excluído com sucesso.');
              } else {
                Alert.alert('Erro', 'Erro ao excluir cliente.');
              }
            },
          },
        ],
      );
    },
    [deleteClient],
  );

  const handleLogout = useCallback(() => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: logout },
    ]);
  }, [logout]);

  return {
    partner,
    filteredClients,
    isLoading,
    searchTerm,
    setSearchTerm,
    handleDeleteClient,
    handleLogout,
    refreshClients,
  };
};
