import axios from 'axios';
import { Partner } from '../types';

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
}