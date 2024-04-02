const baseUrl = "https://login.e-auditoria.com.br";
const realm = "aplicacao-cliente";
const client_id = "client-cliente";
const client_secret = "EldjqZ7LDThiQ0f4DuLxIIf38VyilZdP";
const redirect_uri = 'http://localhost:9000';

const generateRandomState = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const redirectToKeycloak = () => {
  const state = generateRandomState();
  const nonce = generateRandomState();
  const urlParams = {
    client_id,
    redirect_uri,
    response_mode: "fragment",
    response_type: "code",
    scope: "openid",
    nonce,
    state,
  };
  const connectionURI = new URL(`${baseUrl}/realms/${realm}/protocol/openid-connect/auth`);
  for (const key of Object.keys(urlParams)) {
    connectionURI.searchParams.append(key, urlParams[key]);
  }
  window.location.href = `${connectionURI}`;
};

export const getToken = async (code) => {
  try {
    const formData = new URLSearchParams();
    formData.append('client_id', client_id);
    formData.append('client_secret', client_secret);
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('redirect_uri', redirect_uri);

    const response = await fetch(`${baseUrl}/realms/${realm}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString(),
    });


    if (!response.ok) {
      throw new Error('Failed to get token');
    }

    const data = await response.json();

    console.log('data', data);


    sessionStorage.setItem("token", data.access_token);
    sessionStorage.setItem("id_token", data.id_token);
    sessionStorage.setItem("refresh_token", data.refresh_token);
    sessionStorage.setItem("session_state", data.session_state);
    window.history.replaceState({}, '', '/');
    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
  }
};

export const decodeJWT = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  const decoded = atob(parts[1]);
  const payload = JSON.parse(decoded);
  return payload;
};

export const logout = () => {
  const id_token_hint = sessionStorage.getItem("id_token");
  console.log('id_token_hint', id_token_hint);


  // localStorage.clear();

  // sessionStorage.clear();

  // window.location.href = `https://login.e-auditoria.com.br/realms/aplicacao-cliente/protocol/openid-connect/logout?id_token_hint=${user.id_token}`;


  // const logoutURI = new URL(`${baseUrl}/realms/${realm}/protocol/openid-connect/logout`);
  // const id_token_hint = sessionStorage.getItem("id_token");
  // const urlParams = {
  //   client_id,
  //   post_logout_redirect_uri: redirect_uri,
  //   id_token_hint,
  // };
  // for (const key of Object.keys(urlParams)) {
  //   logoutURI.searchParams.append(key, urlParams[key]);
  // }
  // sessionStorage.clear();
  // window.location.href = `${logoutURI}`;
};