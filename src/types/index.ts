export interface Partner {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface Client {
  id: number;
  partnerId: number;
  name: string;
  document: string;
  age?: number;
  foundationDate?: string;
  monthlyIncome: number;
  balance: number;
}

export interface AuthContextData {
  partner: Partner | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export interface AuthContextData {
  partner: Partner | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export interface ClientContextData {
  clients: Client[];
  isLoading: boolean;
  searchTerm: string;
  filteredClients: Client[];
  setSearchTerm: (term: string) => void;
  createClient: (client: Omit<Client, 'id' | 'partnerId' | 'balance'>) => Promise<boolean>;
  updateClient: (id: number, client: Partial<Client>) => Promise<boolean>;
  deleteClient: (id: number) => Promise<boolean>;
  transfer: (fromClientId: number, toClientId: number, amount: number) => Promise<boolean>;
  refreshClients: () => Promise<void>;
}