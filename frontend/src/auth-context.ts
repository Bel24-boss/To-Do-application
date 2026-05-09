import { createContext } from 'react';

import type { UserSummary } from './types';

export interface AuthContextValue {
  user: UserSummary | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
