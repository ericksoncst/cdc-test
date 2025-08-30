import { ApiService } from '../../services/api';
import axios from 'axios';
import { Partner, Client } from '../../types';

jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
  
  return {
    default: {
      ...mockAxiosInstance,
      create: jest.fn(() => mockAxiosInstance),
    },
    create: jest.fn(() => mockAxiosInstance),
    ...mockAxiosInstance,
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiService', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = (mockedAxios.create as jest.Mock)();
    
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockPartners: Partner[] = [
      {
        id: 1,
        name: 'João Silva',
        email: 'joao@bank.com',
        password: '123456'
      },
      {
        id: 2,
        name: 'Maria Santos', 
        email: 'maria@bank.com',
        password: '123456'
      }
    ];

    it('should return partner when credentials are valid', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: mockPartners
      });

      const result = await ApiService.login('joao@bank.com', '123456');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/partners');
      expect(result).toEqual(mockPartners[0]);
    });

    it('should return null when credentials are invalid', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: mockPartners
      });

      const result = await ApiService.login('wrong@email.com', 'wrongpass');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/partners');
      expect(result).toBeNull();
    });

    it('should throw error when API call fails', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      await expect(ApiService.login('joao@bank.com', '123456'))
        .rejects.toThrow('Erro ao fazer login. Verifique sua conexão.');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/partners');
    });
  });

  describe('getClientsByPartnerId', () => {
    const mockClients: Client[] = [
      {
        id: 2,
        partnerId: 1,
        name: 'Ana Costa X',
        document: '98765432100',
        age: 30,
        monthlyIncome: 3500,
        balance: 3000
      },
      {
        id: 3,
        partnerId: 1,
        name: 'Carlos Ferreira',
        document: '11122233300',
        age: 42,
        monthlyIncome: 7200,
        balance: 1140.25
      }
    ];

    it('should return clients for valid partner ID', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: mockClients
      });

      const result = await ApiService.getClientsByPartnerId(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/clients?partnerId=1');
      expect(result).toEqual(mockClients);
    });

    it('should throw error when API call fails', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      await expect(ApiService.getClientsByPartnerId(1))
        .rejects.toThrow('Erro ao carregar clientes.');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/clients?partnerId=1');
    });
  });

  describe('createClient', () => {
    const newClient: Omit<Client, 'id'> = {
      partnerId: 1,
      name: 'New Client',
      document: '12345678900',
      age: 25,
      monthlyIncome: 5000,
      balance: 0
    };

    const createdClient: Client = {
      id: 123,
      ...newClient
    };

    it('should create and return new client', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: createdClient
      });

      const result = await ApiService.createClient(newClient);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/clients', newClient);
      expect(result).toEqual(createdClient);
    });

    it('should throw error when creation fails', async () => {
      mockAxiosInstance.post.mockRejectedValue(new Error('Network error'));

      await expect(ApiService.createClient(newClient))
        .rejects.toThrow('Erro ao criar cliente.');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/clients', newClient);
    });
  });

  describe('updateClient', () => {
    const clientUpdate: Partial<Client> = {
      name: 'Updated Name',
      monthlyIncome: 6000
    };

    const updatedClient: Client = {
      id: 2,
      partnerId: 1,
      name: 'Updated Name',
      document: '98765432100',
      age: 30,
      monthlyIncome: 6000,
      balance: 3000
    };

    it('should update and return client', async () => {
      mockAxiosInstance.patch.mockResolvedValue({
        data: updatedClient
      });

      const result = await ApiService.updateClient(2, clientUpdate);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/clients/2', clientUpdate);
      expect(result).toEqual(updatedClient);
    });

    it('should throw error when update fails', async () => {
      mockAxiosInstance.patch.mockRejectedValue(new Error('Network error'));

      await expect(ApiService.updateClient(2, clientUpdate))
        .rejects.toThrow('Erro ao atualizar cliente.');

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/clients/2', clientUpdate);
    });
  });

  describe('deleteClient', () => {
    it('should delete client successfully', async () => {
      mockAxiosInstance.delete.mockResolvedValue({});

      await ApiService.deleteClient(2);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/clients/2');
    });

    it('should throw error when deletion fails', async () => {
      mockAxiosInstance.delete.mockRejectedValue(new Error('Network error'));

      await expect(ApiService.deleteClient(2))
        .rejects.toThrow('Erro ao excluir cliente.');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/clients/2');
    });
  });

  describe('getClientById', () => {
    const mockClient: Client = {
      id: 2,
      partnerId: 1,
      name: 'Ana Costa X',
      document: '98765432100',
      age: 30,
      monthlyIncome: 3500,
      balance: 3000
    };

    it('should return client when ID exists', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: mockClient
      });

      const result = await ApiService.getClientById(2);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/clients/2');
      expect(result).toEqual(mockClient);
    });

    it('should return null when API call fails', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Client not found'));

      const result = await ApiService.getClientById(999);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/clients/999');
      expect(result).toBeNull();
    });
  });

  describe('transfer', () => {
    const fromClient: Client = {
      id: 2,
      partnerId: 1,
      name: 'Ana Costa X',
      document: '98765432100',
      age: 30,
      monthlyIncome: 3500,
      balance: 3000
    };

    const toClient: Client = {
      id: 3,
      partnerId: 1,
      name: 'Carlos Ferreira',
      document: '11122233300',
      age: 42,
      monthlyIncome: 7200,
      balance: 1140.25
    };

    beforeEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('should transfer successfully with sufficient balance', async () => {
      const transferAmount = 500;
      
      jest.spyOn(ApiService, 'getClientById')
        .mockResolvedValueOnce(fromClient)
        .mockResolvedValueOnce(toClient);
      
      const updateClientSpy = jest.spyOn(ApiService, 'updateClient')
        .mockResolvedValue({} as Client);
      
      const result = await ApiService.transfer(2, 3, transferAmount);

      expect(updateClientSpy).toHaveBeenCalledTimes(2);
      expect(updateClientSpy).toHaveBeenCalledWith(2, {
        balance: fromClient.balance - transferAmount
      });
      expect(updateClientSpy).toHaveBeenCalledWith(3, {
        balance: toClient.balance + transferAmount
      });

      expect(result).toBe(true);
    });

    it('should throw error when from client does not exist', async () => {

      jest.spyOn(ApiService, 'getClientById')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(toClient);

      await expect(ApiService.transfer(999, 3, 500))
        .rejects.toThrow('Cliente não encontrado.');

      expect(mockAxiosInstance.patch).not.toHaveBeenCalled();
    });

    it('should throw error when to client does not exist', async () => {

      jest.spyOn(ApiService, 'getClientById')
        .mockResolvedValueOnce(fromClient)
        .mockResolvedValueOnce(null);

      await expect(ApiService.transfer(2, 999, 500))
        .rejects.toThrow('Cliente não encontrado.');

      expect(mockAxiosInstance.patch).not.toHaveBeenCalled();
    });

    it('should throw error when insufficient balance', async () => {
      const transferAmount = 5000;
      
      jest.spyOn(ApiService, 'getClientById')
        .mockResolvedValueOnce(fromClient)
        .mockResolvedValueOnce(toClient);

      await expect(ApiService.transfer(2, 3, transferAmount))
        .rejects.toThrow('Saldo insuficiente.');

      expect(mockAxiosInstance.patch).not.toHaveBeenCalled();
    });

    it('should throw error when update operation fails', async () => {
      jest.spyOn(ApiService, 'getClientById')
        .mockResolvedValueOnce(fromClient)
        .mockResolvedValueOnce(toClient);
      
      jest.spyOn(ApiService, 'updateClient')
        .mockRejectedValue(new Error('Update failed'));

      await expect(ApiService.transfer(2, 3, 500))
        .rejects.toThrow('Update failed');
    });
  });

  describe('API configuration', () => {
    it('should have axios instance properly mocked', () => {
      expect(mockAxiosInstance).toBeDefined();
      expect(mockAxiosInstance.get).toBeDefined();
      expect(mockAxiosInstance.post).toBeDefined();
      expect(mockAxiosInstance.patch).toBeDefined();
      expect(mockAxiosInstance.delete).toBeDefined();
    });
  });
});