import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../contexts/AuthContext';
import { useClients } from '../../contexts/ClientContext';
import { Client } from '../../types';
import { formatCurrency, formatDocument } from '../../utils';
import Input from '../../components/input/Input';
import Button from '../../components/Button/Button';


interface ClientsPanelProps {
  navigation: any;
}

const ClientsPanel: React.FC<ClientsPanelProps> = ({ navigation }) => {
  const { partner, logout } = useAuth();
  const {
    filteredClients,
    isLoading,
    searchTerm,
    setSearchTerm,
    deleteClient,
    refreshClients
  } = useClients();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshClients();
    });
    return unsubscribe;
  }, [navigation, refreshClients]);

  const handleDeleteClient = (client: Client) => {
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
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: logout }
    ]);
  };

  const renderClientItem = ({ item }: { item: Client }) => (
    <View style={styles.clientItem}>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.name}</Text>
        <Text style={styles.clientDocument}>{formatDocument(item.document)}</Text>
        <Text style={styles.clientBalance}>{formatCurrency(item.balance)}</Text>
      </View>
      <View style={styles.clientActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditClient', { client: item })}
        >
          <Icon name="edit-2" size={16} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteClient(item)}
        >
          <Icon name="trash-2" size={16} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Meus Clientes</Text>
          <Text style={styles.headerSubtitle}>Olá, {partner?.name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="log-out" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar por nome ou CPF/CNPJ"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <View style={styles.listContainer}>
        {isLoading && filteredClients.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Carregando clientes...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredClients}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderClientItem}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refreshClients}
                tintColor="#007AFF"
              />
            }
          />
        )}
      </View>

      <View style={styles.actionButtons}>
        <View style={styles.buttonRow}>
          <View style={styles.buttonContainer}>
            <Button
              title="Novo Cliente"
              onPress={() => navigation.navigate('CreateClient')}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Transferir"
              onPress={() => navigation.navigate('Transfer')}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  headerContent: {
    flex: 1
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  logoutButton: {
    padding: 8
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20
  },
  clientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  clientInfo: {
    flex: 1
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  clientDocument: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  clientBalance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  clientActions: {
    flexDirection: 'row'
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  editButton: {
    backgroundColor: '#e3f2fd'
  },
  deleteButton: {
    backgroundColor: '#ffebee'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 8
  }
});

export default ClientsPanel;