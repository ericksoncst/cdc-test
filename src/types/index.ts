export interface Partner {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface AuthContextData {
  partner: Partner | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}