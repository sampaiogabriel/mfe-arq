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

export interface UseAuthStoreProps {
  user: UserProps | null;
  logout: () => void;
}

const useAuthStore = create<UseAuthStoreProps>(() => ({
  user: null,
  logout: () => {
    const authData = JSON.parse(sessionStorage.getItem('@auth/token'));

    sessionStorage.removeItem('@auth/token');

    window.location.href = `https://login.e-auditoria.com.br/realms/aplicacao-cliente/protocol/openid-connect/logout?id_token_hint=${authData.id_token}`;
  },
}));

export const decodeJWT = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  const decoded = atob(parts[1]);
  const payload = JSON.parse(decoded);
  return payload;
};

// Carregue o token do localStorage ao inicializar a aplicação
const initialToken = JSON.parse(sessionStorage.getItem('@auth/token'));

const tokenDecoded = decodeJWT(initialToken.access_token);

if (tokenDecoded) {
  useAuthStore.setState({
    user: tokenDecoded,
  });
}

export default useAuthStore;
