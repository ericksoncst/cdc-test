import axios from 'axios';
import { Client, Partner } from '../types';

const BASE_URL = 'http://10.0.2.2:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export class ApiService {

    static async login(email: string, password: string): Promise<Partner | null> {
    try {
      const response = await api.get<Partner[]>('/partners');
      const partner = response.data.find(
        p => p.email === email && p.password === password
      );
      return partner || null;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Erro ao fazer login. Verifique sua conexão.');
    }
  }

    static async getClientsByPartnerId(partnerId: number): Promise<Client[]> {
    try {
      const response = await api.get<Client[]>(`/clients?partnerId=${partnerId}`);
      return response.data;
    } catch (error) {
      console.error('Get clients error:', error);
      throw new Error('Erro ao carregar clientes.');
    }
  }

  static async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    try {
      const response = await api.post<Client>('/clients', client);
      return response.data;
    } catch (error) {
      console.error('Create client error:', error);
      throw new Error('Erro ao criar cliente.');
    }
  }

  static async updateClient(id: number, client: Partial<Client>): Promise<Client> {
    try {
      const response = await api.patch<Client>(`/clients/${id}`, client);
      return response.data;
    } catch (error) {
      console.error('Update client error:', error);
      throw new Error('Erro ao atualizar cliente.');
    }
  }

  static async deleteClient(id: number): Promise<void> {
    try {
      await api.delete(`/clients/${id}`);
    } catch (error) {
      console.error('Delete client error:', error);
      throw new Error('Erro ao excluir cliente.');
    }
  }

  static async getClientById(id: number): Promise<Client | null> {
    try {
      const response = await api.get<Client>(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get client by id error:', error);
      return null;
    }
  }

   static async transfer(fromClientId: number, toClientId: number, amount: number): Promise<boolean> {
    try {

      const fromClient = await this.getClientById(fromClientId);
      const toClient = await this.getClientById(toClientId);

      if (!fromClient || !toClient) {
        throw new Error('Cliente não encontrado.');
      }

      if (fromClient.balance < amount) {
        throw new Error('Saldo insuficiente.');
      }

      await Promise.all([
        this.updateClient(fromClientId, { balance: fromClient.balance - amount }),
        this.updateClient(toClientId, { balance: toClient.balance + amount })
      ]);

      return true;
    } catch (error) {
      console.error('Transfer error:', error);
      throw error;
    }
  }
}