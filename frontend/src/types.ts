export interface UserSummary {
  id: number;
  email: string;
  is_active: boolean;
}

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  owner_id: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ProtectedResponse {
  authenticated: boolean;
  message: string;
  user: UserSummary;
}

export interface LoginLocationState {
  email?: string;
  registered?: boolean;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodoDraft {
  title: string;
  description: string;
}
