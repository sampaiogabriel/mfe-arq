const baseUrl = 'https://login.e-auditoria.com.br';
const realm = 'aplicacao-cliente';
const clientId = 'client-cliente';
const clientSecret = 'EldjqZ7LDThiQ0f4DuLxIIf38VyilZdP';
const redirectUri = 'http://localhost:9000';

/**
 * Manipula a autenticação do usuário, redirecionando para o servidor Keycloak ou obtendo tokens de acesso.
 * @returns {Promise<boolean>} - Uma promessa que resolve para verdadeiro se a autenticação for bem-sucedida, ou falso caso contrário.
 */
export const handleAuth = async () => {
  try {
    const authData = sessionStorage.getItem('@auth/token');
    const urlParams = new URLSearchParams(window.location.hash.split('#')[1]);
    const code = urlParams.get('code');

    if (!authData && !code) {
      redirectToKeycloak();
      return false;
    }

    if (!authData && code) {
      await getToken(code);
      return false;
    }

    const refreshToken = JSON.parse(authData).refresh_token;
    const responseRefreshtoken = await validateToken(refreshToken);

    if (responseRefreshtoken) {
      return true;
    } else {
      logout();
      redirectToKeycloak();
      return false;
    }
  } catch (error) {
    logout();
    redirectToKeycloak();
    return false;
  }
};

/**
 * Gera um estado aleatório para ser usado durante a autenticação.
 * @returns {string} - Uma string contendo o estado aleatório gerado.
 */
const generateRandomState = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Decodifica um token JWT e retorna o payload.
 * @param {string} token - O token JWT a ser decodificado.
 * @returns {object} - O payload do token decodificado.
 */
export const decodeJWT = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  const decoded = atob(parts[1]);
  const payload = JSON.parse(decoded);
  return payload;
};

/**
 * Redireciona o usuário para o servidor Keycloak para iniciar o processo de autenticação.
 */
export const redirectToKeycloak = () => {
  const state = generateRandomState();
  const nonce = generateRandomState();
  const urlParams = {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_mode: 'fragment',
    response_type: 'code',
    scope: 'openid',
    nonce,
    state,
  };

  const connectionURI = new URL(
    `${baseUrl}/realms/${realm}/protocol/openid-connect/auth`,
  );
  for (const key of Object.keys(urlParams)) {
    connectionURI.searchParams.append(key, urlParams[key]);
  }
  window.location.href = `${connectionURI}`;
};

/**
 * Obtém o token de acesso do servidor Keycloak usando o código de autorização recebido após o login.
 * @param {string} code - O código de autorização recebido após o login.
 */
export const getToken = async (code) => {
  try {
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('redirect_uri', redirectUri);

    const response = await fetch(
      `${baseUrl}/realms/${realm}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to get token');
    }

    const data = await response.json();

    const authData = {
      access_token: data.access_token,
      id_token: data.id_token,
      refresh_token: data.refresh_token,
      session_state: data.session_state,
    };

    sessionStorage.setItem('@auth/token', JSON.stringify(authData));

    window.history.replaceState({}, '', '/');
    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Realiza o logout do usuário, limpando os dados de autenticação armazenados na sessão do navegador.
 */
export const logout = () => {
  const authData = JSON.parse(sessionStorage.getItem('@auth/token'));

  sessionStorage.removeItem('@auth/token');

  window.location.href = `${baseUrl}/realms/${realm}/protocol/openid-connect/logout?id_token_hint=${authData.id_token}`;
};

/**
 * Valida o token de atualização obtido do servidor Keycloak.
 * @param {string} refreshToken - O token de atualização a ser validado.
 * @returns {Promise<boolean>} - Uma promessa que resolve para verdadeiro se o token de atualização for válido, ou falso caso contrário.
 */
export const validateToken = async (refreshToken: string) => {
  const formData = new URLSearchParams();
  formData.append('client_id', 'client-cliente');
  formData.append('client_secret', 'EldjqZ7LDThiQ0f4DuLxIIf38VyilZdP');
  formData.append('grant_type', 'refresh_token');
  formData.append('refresh_token', refreshToken);

  const response = await fetch(
    `${baseUrl}/realms/${realm}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    },
  );

  return response.status !== 400;
};
