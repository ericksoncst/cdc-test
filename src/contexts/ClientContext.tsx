import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { Client, ClientContextData } from '../types';
import { ApiService } from '../services/api';
import { useAuth } from './AuthContext';

const ClientContext = createContext<ClientContextData>({} as ClientContextData);

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const { partner } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.name.toLowerCase().includes(term) ||
      client.document.includes(term)
    );
  }, [clients, searchTerm]);

  useEffect(() => {
    if (partner) {
      refreshClients();
    }
  }, [partner]);

  const refreshClients = async (): Promise<void> => {
    if (!partner) return;
    
    try {
      setIsLoading(true);
      const fetchedClients = await ApiService.getClientsByPartnerId(partner.id);
      setClients(fetchedClients);
    } catch (error) {
      console.error('Error refreshing clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'partnerId' | 'balance'>): Promise<boolean> => {
    if (!partner) return false;

    try {
      setIsLoading(true);
      const newClient = await ApiService.createClient({
        ...clientData,
        partnerId: partner.id,
        balance: 0,
      });
      setClients(prev => [...prev, newClient]);
      return true;
    } catch (error) {
      console.error('Error creating client:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (id: number, clientData: Partial<Client>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const updatedClient = await ApiService.updateClient(id, clientData);
      setClients(prev => prev.map(client => 
        client.id === id ? updatedClient : client
      ));
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClient = async (id: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      await ApiService.deleteClient(id);
      setClients(prev => prev.filter(client => client.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const transfer = async (fromClientId: number, toClientId: number, amount: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      await ApiService.transfer(fromClientId, toClientId, amount);
      
      setClients(prev => prev.map(client => {
        if (client.id === fromClientId) {
          return { ...client, balance: client.balance - amount };
        }
        if (client.id === toClientId) {
          return { ...client, balance: client.balance + amount };
        }
        return client;
      }));
      
      return true;
    } catch (error) {
      console.error('Error transferring:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        isLoading,
        searchTerm,
        filteredClients,
        setSearchTerm,
        createClient,
        updateClient,
        deleteClient,
        transfer,
        refreshClients,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = (): ClientContextData => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};