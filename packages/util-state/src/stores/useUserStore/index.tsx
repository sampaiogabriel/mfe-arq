/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';

interface ProfileProps {
  email: string;
  name: string;
  given_name: string;
  family_name: string;
}

interface UserProps {
  id_token: string;
  access_token: string;
  refresh_token: string;
  profile: ProfileProps;
}

export interface UseUserStoreProps {
  user: UserProps | null;
  setUser: (user: UserProps) => void;
  logout: () => void;
}

const useUserStore = create<UseUserStoreProps>((set, getState) => ({
  user: null,

  setUser: (user: UserProps) => set({ user }),

  logout: () => {
    // const user = getState().user;
    const Id = sessionStorage.getItem('id_token');

    localStorage.clear();

    sessionStorage.clear();

    window.location.href = `https://login.e-auditoria.com.br/realms/aplicacao-cliente/protocol/openid-connect/logout?id_token_hint=${Id}`;
  },
}));

export default useUserStore;
